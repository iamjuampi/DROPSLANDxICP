import Array "mo:base/Array";
import Buffer "mo:base/Buffer";
import HashMap "mo:base/HashMap";
import Iter "mo:base/Iter";
import Nat "mo:base/Nat";
import Nat32 "mo:base/Nat32";
import Option "mo:base/Option";
import Principal "mo:base/Principal";
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
        createdAt: Time.Time;
    };

    type Drop = {
        id: Nat;
        title: Text;
        description: Text;
        creatorId: Principal;
        createdAt: Time.Time;
    };

    // Hash function for Principal
    func principalHash(p: Principal) : Nat32 {
        Text.hash(Principal.toText(p));
    };

    // Hash function for Nat
    func natHash(n: Nat) : Nat32 {
        Nat32.fromNat(n);
    };

    // State
    private stable var nextDropId: Nat = 1;
    private var users = HashMap.HashMap<Principal, User>(0, Principal.equal, principalHash);
    private var drops = HashMap.HashMap<Nat, Drop>(0, Nat.equal, natHash);

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
                    createdAt = Time.now();
                };
                users.put(caller, newUser);
                return #ok(newUser);
            };
        };
    };

    public query func getUser(userId: Principal) : async ?User {
        users.get(userId)
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

    // System
    public query func getCanisterStatus() : async Text {
        "Running"
    };
} 