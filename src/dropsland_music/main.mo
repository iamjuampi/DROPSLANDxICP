import Array "mo:base/Array";
import Blob "mo:base/Blob";
import Buffer "mo:base/Buffer";
import Error "mo:base/Error";
import HashMap "mo:base/HashMap";
import Hash "mo:base/Hash";
import Int "mo:base/Int";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Nat8 "mo:base/Nat8";
import Nat32 "mo:base/Nat32";
import Option "mo:base/Option";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Text "mo:base/Text";
import Time "mo:base/Time";

actor {
    // Types
    type MusicFile = {
        id: Text;
        name: Text;
        artist: Text;
        data: [Nat8];
        contentType: Text;
        size: Nat;
        uploadedAt: Int;
    };

    type MusicMetadata = {
        id: Text;
        name: Text;
        artist: Text;
        size: Nat;
        contentType: Text;
        uploadedAt: Int;
    };

    // State
    private stable var musicFiles: [(Text, MusicFile)] = [];
    private var musicStore = HashMap.HashMap<Text, MusicFile>(0, Text.equal, Text.hash);
    private stable var nextId: Nat = 0;

    // System functions
    system func preupgrade() {
        musicFiles := Iter.toArray(musicStore.entries());
    };

    system func postupgrade() {
        musicStore := HashMap.HashMap<Text, MusicFile>(0, Text.equal, Text.hash);
        for ((id, file) in musicFiles.vals()) {
            musicStore.put(id, file);
        };
        musicFiles := [];
    };

    // Helper functions
    private func generateId(): Text {
        let id = Nat.toText(nextId);
        nextId += 1;
        id
    };

    // Public functions
    public shared({caller}) func uploadMusic(
        name: Text,
        artist: Text,
        data: [Nat8],
        contentType: Text
    ): async Result.Result<Text, Text> {
        // For now, allow anyone to upload (you can add authentication later)
        let id = generateId();
        let musicFile: MusicFile = {
            id = id;
            name = name;
            artist = artist;
            data = data;
            contentType = contentType;
            size = data.size();
            uploadedAt = Time.now();
        };

        musicStore.put(id, musicFile);
        #ok(id)
    };

    public query func getMusicMetadata(id: Text): async Result.Result<MusicMetadata, Text> {
        switch (musicStore.get(id)) {
            case (?file) {
                let metadata: MusicMetadata = {
                    id = file.id;
                    name = file.name;
                    artist = file.artist;
                    size = file.size;
                    contentType = file.contentType;
                    uploadedAt = file.uploadedAt;
                };
                #ok(metadata)
            };
            case null { #err("Music file not found") };
        }
    };

    public query func getAllMusicMetadata(): async [MusicMetadata] {
        let buffer = Buffer.Buffer<MusicMetadata>(0);
        for ((_, file) in musicStore.entries()) {
            let metadata: MusicMetadata = {
                id = file.id;
                name = file.name;
                artist = file.artist;
                size = file.size;
                contentType = file.contentType;
                uploadedAt = file.uploadedAt;
            };
            buffer.add(metadata);
        };
        Buffer.toArray(buffer)
    };

    public query func getMusicData(id: Text): async Result.Result<[Nat8], Text> {
        switch (musicStore.get(id)) {
            case (?file) { #ok(file.data) };
            case null { #err("Music file not found") };
        }
    };

    public query func getMusicFile(id: Text): async Result.Result<MusicFile, Text> {
        switch (musicStore.get(id)) {
            case (?file) { #ok(file) };
            case null { #err("Music file not found") };
        }
    };
} 