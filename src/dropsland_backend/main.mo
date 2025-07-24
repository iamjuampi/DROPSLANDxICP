import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Nat32 "mo:base/Nat32";
import Nat8 "mo:base/Nat8";
import Option "mo:base/Option";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Time "mo:base/Time";

actor DropslandBackend {
    // Types
    type Result<T, E> = {
        #ok : T;
        #err : E;
    };

    type User = {
        id: Principal;
        username: Text;
        handle: ?Text;  // @username
        profileImage: ?Text;  // URL or data URI for profile image
        coverImage: ?Text;    // URL or data URI for cover image
        createdAt: Time.Time;
        updatedAt: Time.Time;
    };

    type Drop = {
        id: Nat;
        title: Text;
        description: Text;
        creatorId: Principal;
        createdAt: Time.Time;
    };

    // Music Types
    type MusicFile = {
        id: Text;
        name: Text;
        artist: Text;
        data: [Nat8];
        contentType: Text;
        size: Nat;
        uploadedAt: Time.Time;
        uploadedBy: Principal;
    };

    type MusicMetadata = {
        id: Text;
        name: Text;
        artist: Text;
        size: Nat;
        contentType: Text;
        uploadedAt: Time.Time;
        uploadedBy: Principal;
    };

    // Chunked upload types
    type UploadSession = {
        id: Text;
        name: Text;
        artist: Text;
        contentType: Text;
        totalChunks: Nat;
        uploadedChunks: Nat;
        totalSize: Nat;
        uploadedBy: Principal;
        createdAt: Time.Time;
        expiresAt: Time.Time;
    };

    type ChunkData = {
        sessionId: Text;
        chunkIndex: Nat;
        data: [Nat8];
    };

    // Hash function for Principal
    func principalHash(p: Principal) : Nat32 {
        Text.hash(Principal.toText(p));
    };

    // Hash function for Nat
    func natHash(n: Nat) : Nat32 {
        Nat32.fromNat(n);
    };

    // Hash function for Text
    func textHash(t: Text) : Nat32 {
        Text.hash(t);
    };

    // State
    private stable var nextDropId: Nat = 1;
    private stable var nextMusicId: Nat = 1;
    private stable var nextSessionId: Nat = 1;
    private var users = HashMap.HashMap<Principal, User>(0, Principal.equal, principalHash);
    private var drops = HashMap.HashMap<Nat, Drop>(0, Nat.equal, natHash);
    
    // Music storage
    private stable var musicFiles: [(Text, MusicFile)] = [];
    private var musicStore = HashMap.HashMap<Text, MusicFile>(0, Text.equal, textHash);

    // Chunked upload storage
    private stable var uploadSessions: [(Text, UploadSession)] = [];
    private stable var uploadChunks: [(Text, [Nat8])] = [];
    private var sessionStore = HashMap.HashMap<Text, UploadSession>(0, Text.equal, textHash);
    private var chunkStore = HashMap.HashMap<Text, [Nat8]>(0, Text.equal, textHash);

    // System functions for music persistence
    system func preupgrade() {
        musicFiles := Iter.toArray(musicStore.entries());
        uploadSessions := Iter.toArray(sessionStore.entries());
        uploadChunks := Iter.toArray(chunkStore.entries());
    };

    system func postupgrade() {
        musicStore := HashMap.HashMap<Text, MusicFile>(0, Text.equal, textHash);
        for ((id, file) in musicFiles.vals()) {
            musicStore.put(id, file);
        };
        musicFiles := [];

        sessionStore := HashMap.HashMap<Text, UploadSession>(0, Text.equal, textHash);
        for ((id, session) in uploadSessions.vals()) {
            sessionStore.put(id, session);
        };
        uploadSessions := [];

        chunkStore := HashMap.HashMap<Text, [Nat8]>(0, Text.equal, textHash);
        for ((id, chunk) in uploadChunks.vals()) {
            chunkStore.put(id, chunk);
        };
        uploadChunks := [];
    };

    // Helper functions
    private func generateMusicId(): Text {
        let id = Nat.toText(nextMusicId);
        nextMusicId += 1;
        id
    };

    private func generateSessionId(): Text {
        let id = Nat.toText(nextSessionId);
        nextSessionId += 1;
        id
    };

    private func generateChunkKey(sessionId: Text, chunkIndex: Nat): Text {
        sessionId # "_" # Nat.toText(chunkIndex)
    };

    // Clean up expired sessions
    private func cleanupExpiredSessions() {
        let now = Time.now();
        let expiredSessions = Buffer.Buffer<Text>(0);
        
        for ((sessionId, session) in sessionStore.entries()) {
            if (session.expiresAt < now) {
                expiredSessions.add(sessionId);
            };
        };
        
        for (sessionId in expiredSessions.vals()) {
            sessionStore.delete(sessionId);
        };
    };

    // User Management
    public shared(msg) func createUser(username: Text) : async Result<User, Text> {
        let caller = msg.caller;
        if (Principal.isAnonymous(caller)) {
            return #err("Anonymous users cannot create accounts");
        };

        switch (users.get(caller)) {
            case (?existingUser) {
                return #err("User already exists");
            };
            case null {
                let newUser = {
                    id = caller;
                    username = username;
                    handle = null;
                    profileImage = null;
                    coverImage = null;
                    createdAt = Time.now();
                    updatedAt = Time.now();
                };
                users.put(caller, newUser);
                return #ok(newUser);
            };
        };
    };

    public query func getUser(userId: Principal) : async ?User {
        users.get(userId)
    };

    // Update user profile
    public shared(msg) func updateUserProfile(
        username: ?Text,
        handle: ?Text,
        profileImage: ?Text,
        coverImage: ?Text
    ) : async Result<User, Text> {
        let caller = msg.caller;
        if (Principal.isAnonymous(caller)) {
            return #err("Anonymous users cannot update profiles");
        };

        switch (users.get(caller)) {
            case (?existingUser) {
                let updatedUser: User = {
                    id = existingUser.id;
                    username = Option.get(username, existingUser.username);
                    handle = handle;
                    profileImage = profileImage;
                    coverImage = coverImage;
                    createdAt = existingUser.createdAt;
                    updatedAt = Time.now();
                };
                users.put(caller, updatedUser);
                return #ok(updatedUser);
            };
            case null {
                return #err("User not found");
            };
        };
    };

    // Update specific profile fields
    public shared(msg) func updateUsername(username: Text) : async Result<User, Text> {
        let caller = msg.caller;
        if (Principal.isAnonymous(caller)) {
            return #err("Anonymous users cannot update profiles");
        };

        switch (users.get(caller)) {
            case (?existingUser) {
                let updatedUser: User = {
                    id = existingUser.id;
                    username = username;
                    handle = existingUser.handle;
                    profileImage = existingUser.profileImage;
                    coverImage = existingUser.coverImage;
                    createdAt = existingUser.createdAt;
                    updatedAt = Time.now();
                };
                users.put(caller, updatedUser);
                return #ok(updatedUser);
            };
            case null {
                return #err("User not found");
            };
        };
    };

    public shared(msg) func updateHandle(handle: Text) : async Result<User, Text> {
        let caller = msg.caller;
        if (Principal.isAnonymous(caller)) {
            return #err("Anonymous users cannot update profiles");
        };

        switch (users.get(caller)) {
            case (?existingUser) {
                let updatedUser: User = {
                    id = existingUser.id;
                    username = existingUser.username;
                    handle = ?handle;
                    profileImage = existingUser.profileImage;
                    coverImage = existingUser.coverImage;
                    createdAt = existingUser.createdAt;
                    updatedAt = Time.now();
                };
                users.put(caller, updatedUser);
                return #ok(updatedUser);
            };
            case null {
                return #err("User not found");
            };
        };
    };

    public shared(msg) func updateProfileImage(profileImage: Text) : async Result<User, Text> {
        let caller = msg.caller;
        if (Principal.isAnonymous(caller)) {
            return #err("Anonymous users cannot update profiles");
        };

        switch (users.get(caller)) {
            case (?existingUser) {
                let updatedUser: User = {
                    id = existingUser.id;
                    username = existingUser.username;
                    handle = existingUser.handle;
                    profileImage = ?profileImage;
                    coverImage = existingUser.coverImage;
                    createdAt = existingUser.createdAt;
                    updatedAt = Time.now();
                };
                users.put(caller, updatedUser);
                return #ok(updatedUser);
            };
            case null {
                return #err("User not found");
            };
        };
    };

    public shared(msg) func updateCoverImage(coverImage: Text) : async Result<User, Text> {
        let caller = msg.caller;
        if (Principal.isAnonymous(caller)) {
            return #err("Anonymous users cannot update profiles");
        };

        switch (users.get(caller)) {
            case (?existingUser) {
                let updatedUser: User = {
                    id = existingUser.id;
                    username = existingUser.username;
                    handle = existingUser.handle;
                    profileImage = existingUser.profileImage;
                    coverImage = ?coverImage;
                    createdAt = existingUser.createdAt;
                    updatedAt = Time.now();
                };
                users.put(caller, updatedUser);
                return #ok(updatedUser);
            };
            case null {
                return #err("User not found");
            };
        };
    };

    // Drop Management
    public shared(msg) func createDrop(title: Text, description: Text) : async Result<Drop, Text> {
        let caller = msg.caller;
        if (Principal.isAnonymous(caller)) {
            return #err("Anonymous users cannot create drops");
        };

        let dropId = nextDropId;
        nextDropId += 1;

        let newDrop = {
            id = dropId;
            title = title;
            description = description;
            creatorId = caller;
            createdAt = Time.now();
        };

        drops.put(dropId, newDrop);
        return #ok(newDrop);
    };

    public query func getDrop(dropId: Nat) : async ?Drop {
        drops.get(dropId)
    };

    public query func getAllDrops() : async [Drop] {
        Iter.toArray(drops.vals())
    };

    // Music Management
    public shared(msg) func uploadMusic(
        name: Text,
        artist: Text,
        data: [Nat8],
        contentType: Text
    ) : async Result<Text, Text> {
        let caller = msg.caller;
        if (Principal.isAnonymous(caller)) {
            return #err("Anonymous users cannot upload music");
        };

        // Check if user exists
        switch (users.get(caller)) {
            case null {
                return #err("User must be registered to upload music");
            };
            case (?user) {
                // Continue with upload
            };
        };

        let id = generateMusicId();
        let musicFile: MusicFile = {
            id = id;
            name = name;
            artist = artist;
            data = data;
            contentType = contentType;
            size = data.size();
            uploadedAt = Time.now();
            uploadedBy = caller;
        };

        musicStore.put(id, musicFile);
        return #ok(id);
    };

    public query func getMusicMetadata(id: Text) : async Result<MusicMetadata, Text> {
        switch (musicStore.get(id)) {
            case (?file) {
                let metadata: MusicMetadata = {
                    id = file.id;
                    name = file.name;
                    artist = file.artist;
                    size = file.size;
                    contentType = file.contentType;
                    uploadedAt = file.uploadedAt;
                    uploadedBy = file.uploadedBy;
                };
                return #ok(metadata);
            };
            case null {
                return #err("Music file not found");
            };
        }
    };

    public query func getAllMusicMetadata() : async [MusicMetadata] {
        let buffer = Buffer.Buffer<MusicMetadata>(0);
        for ((_, file) in musicStore.entries()) {
            let metadata: MusicMetadata = {
                id = file.id;
                name = file.name;
                artist = file.artist;
                size = file.size;
                contentType = file.contentType;
                uploadedAt = file.uploadedAt;
                uploadedBy = file.uploadedBy;
            };
            buffer.add(metadata);
        };
        Buffer.toArray(buffer)
    };

    public query func getMusicData(id: Text) : async Result<[Nat8], Text> {
        switch (musicStore.get(id)) {
            case (?file) {
                return #ok(file.data);
            };
            case null {
                return #err("Music file not found");
            };
        }
    };

    public query func getMusicFile(id: Text) : async Result<MusicFile, Text> {
        switch (musicStore.get(id)) {
            case (?file) {
                return #ok(file);
            };
            case null {
                return #err("Music file not found");
            };
        }
    };

    public shared(msg) func deleteMusic(id: Text) : async Result<(), Text> {
        let caller = msg.caller;
        
        switch (musicStore.get(id)) {
            case (?file) {
                // Only the uploader can delete the file
                if (Principal.equal(file.uploadedBy, caller)) {
                    musicStore.delete(id);
                    return #ok(());
                } else {
                    return #err("Only the uploader can delete this file");
                };
            };
            case null {
                return #err("Music file not found");
            };
        }
    };

    // Chunked Upload Functions
    public shared(msg) func createUploadSession(
        name: Text,
        artist: Text,
        contentType: Text,
        totalChunks: Nat,
        totalSize: Nat
    ) : async Result<Text, Text> {
        let caller = msg.caller;
        if (Principal.isAnonymous(caller)) {
            return #err("Anonymous users cannot create upload sessions");
        };

        // Check if user exists
        switch (users.get(caller)) {
            case null {
                return #err("User must be registered to upload music");
            };
            case (?user) {
                // Continue with session creation
            };
        };

        let sessionId = generateSessionId();
        let now = Time.now();
        let expiresAt = now + 3600_000_000_000; // 1 hour expiration

        let session: UploadSession = {
            id = sessionId;
            name = name;
            artist = artist;
            contentType = contentType;
            totalChunks = totalChunks;
            uploadedChunks = 0;
            totalSize = totalSize;
            uploadedBy = caller;
            createdAt = now;
            expiresAt = expiresAt;
        };

        sessionStore.put(sessionId, session);
        return #ok(sessionId);
    };

    public shared(msg) func uploadChunk(
        sessionId: Text,
        chunkIndex: Nat,
        data: [Nat8]
    ) : async Result<(), Text> {
        let caller = msg.caller;
        
        switch (sessionStore.get(sessionId)) {
            case (?session) {
                // Check if caller is the session owner
                if (not Principal.equal(session.uploadedBy, caller)) {
                    return #err("Only the session owner can upload chunks");
                };

                // Check if session is expired
                if (session.expiresAt < Time.now()) {
                    return #err("Upload session has expired");
                };

                // Check if chunk index is valid
                if (chunkIndex >= session.totalChunks) {
                    return #err("Invalid chunk index");
                };

                // Store the chunk
                let chunkKey = generateChunkKey(sessionId, chunkIndex);
                chunkStore.put(chunkKey, data);

                // Update session
                let updatedSession: UploadSession = {
                    id = session.id;
                    name = session.name;
                    artist = session.artist;
                    contentType = session.contentType;
                    totalChunks = session.totalChunks;
                    uploadedChunks = session.uploadedChunks + 1;
                    totalSize = session.totalSize;
                    uploadedBy = session.uploadedBy;
                    createdAt = session.createdAt;
                    expiresAt = session.expiresAt;
                };

                sessionStore.put(sessionId, updatedSession);
                return #ok(());
            };
            case null {
                return #err("Upload session not found");
            };
        }
    };

    public shared(msg) func finalizeUpload(sessionId: Text) : async Result<Text, Text> {
        let caller = msg.caller;
        
        switch (sessionStore.get(sessionId)) {
            case (?session) {
                // Check if caller is the session owner
                if (not Principal.equal(session.uploadedBy, caller)) {
                    return #err("Only the session owner can finalize upload");
                };

                // Check if all chunks are uploaded
                if (session.uploadedChunks != session.totalChunks) {
                    return #err("Not all chunks have been uploaded");
                };

                // Combine all chunks
                let combinedData = Buffer.Buffer<Nat8>(0);
                for (i in Iter.range(0, session.totalChunks - 1)) {
                    let chunkKey = generateChunkKey(sessionId, i);
                    switch (chunkStore.get(chunkKey)) {
                        case (?chunk) {
                            for (byte in chunk.vals()) {
                                combinedData.add(byte);
                            };
                        };
                        case null {
                            return #err("Missing chunk data");
                        };
                    };
                };

                // Create music file
                let musicId = generateMusicId();
                let musicFile: MusicFile = {
                    id = musicId;
                    name = session.name;
                    artist = session.artist;
                    data = Buffer.toArray(combinedData);
                    contentType = session.contentType;
                    size = session.totalSize;
                    uploadedAt = Time.now();
                    uploadedBy = session.uploadedBy;
                };

                musicStore.put(musicId, musicFile);

                // Clean up session and chunks
                sessionStore.delete(sessionId);
                for (i in Iter.range(0, session.totalChunks - 1)) {
                    let chunkKey = generateChunkKey(sessionId, i);
                    chunkStore.delete(chunkKey);
                };

                return #ok(musicId);
            };
            case null {
                return #err("Upload session not found");
            };
        }
    };

    public query func getUploadSession(sessionId: Text) : async Result<UploadSession, Text> {
        switch (sessionStore.get(sessionId)) {
            case (?session) {
                return #ok(session);
            };
            case null {
                return #err("Upload session not found");
            };
        }
    };

    public shared(msg) func cancelUpload(sessionId: Text) : async Result<(), Text> {
        let caller = msg.caller;
        
        switch (sessionStore.get(sessionId)) {
            case (?session) {
                // Check if caller is the session owner
                if (not Principal.equal(session.uploadedBy, caller)) {
                    return #err("Only the session owner can cancel upload");
                };

                // Clean up session and chunks
                sessionStore.delete(sessionId);
                for (i in Iter.range(0, session.totalChunks - 1)) {
                    let chunkKey = generateChunkKey(sessionId, i);
                    chunkStore.delete(chunkKey);
                };

                return #ok(());
            };
            case null {
                return #err("Upload session not found");
            };
        }
    };

    // System
    public query func getCanisterStatus() : async Text {
        "Running"
    };

    public query func getMusicStats() : async { totalFiles: Nat; totalSize: Nat } {
        var totalSize: Nat = 0;
        for ((_, file) in musicStore.entries()) {
            totalSize += file.size;
        };
        {
            totalFiles = musicStore.size();
            totalSize = totalSize;
        }
    };
} 