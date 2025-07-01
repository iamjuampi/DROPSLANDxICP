import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Drop {
  'id' : bigint,
  'title' : string,
  'createdAt' : Time,
  'creatorId' : Principal,
  'description' : string,
}
export interface MusicFile {
  'id' : string,
  'contentType' : string,
  'data' : Uint8Array | number[],
  'name' : string,
  'size' : bigint,
  'artist' : string,
  'uploadedAt' : Time,
  'uploadedBy' : Principal,
}
export interface MusicMetadata {
  'id' : string,
  'contentType' : string,
  'name' : string,
  'size' : bigint,
  'artist' : string,
  'uploadedAt' : Time,
  'uploadedBy' : Principal,
}
export type Result = { 'ok' : string } |
  { 'err' : string };
export type Result_1 = { 'ok' : null } |
  { 'err' : string };
export type Result_2 = { 'ok' : UploadSession } |
  { 'err' : string };
export type Result_3 = { 'ok' : MusicMetadata } |
  { 'err' : string };
export type Result_4 = { 'ok' : MusicFile } |
  { 'err' : string };
export type Result_5 = { 'ok' : Uint8Array | number[] } |
  { 'err' : string };
export type Result_6 = { 'ok' : User } |
  { 'err' : string };
export type Result_7 = { 'ok' : Drop } |
  { 'err' : string };
export type Time = bigint;
export interface UploadSession {
  'id' : string,
  'expiresAt' : Time,
  'uploadedChunks' : bigint,
  'contentType' : string,
  'name' : string,
  'createdAt' : Time,
  'totalSize' : bigint,
  'totalChunks' : bigint,
  'artist' : string,
  'uploadedBy' : Principal,
}
export interface User {
  'id' : Principal,
  'username' : string,
  'createdAt' : Time,
}
export interface _SERVICE {
  'cancelUpload' : ActorMethod<[string], Result_1>,
  'createDrop' : ActorMethod<[string, string], Result_7>,
  'createUploadSession' : ActorMethod<
    [string, string, string, bigint, bigint],
    Result
  >,
  'createUser' : ActorMethod<[string], Result_6>,
  'deleteMusic' : ActorMethod<[string], Result_1>,
  'finalizeUpload' : ActorMethod<[string], Result>,
  'getAllDrops' : ActorMethod<[], Array<Drop>>,
  'getAllMusicMetadata' : ActorMethod<[], Array<MusicMetadata>>,
  'getCanisterStatus' : ActorMethod<[], string>,
  'getDrop' : ActorMethod<[bigint], [] | [Drop]>,
  'getMusicData' : ActorMethod<[string], Result_5>,
  'getMusicFile' : ActorMethod<[string], Result_4>,
  'getMusicMetadata' : ActorMethod<[string], Result_3>,
  'getMusicStats' : ActorMethod<
    [],
    { 'totalFiles' : bigint, 'totalSize' : bigint }
  >,
  'getUploadSession' : ActorMethod<[string], Result_2>,
  'getUser' : ActorMethod<[Principal], [] | [User]>,
  'uploadChunk' : ActorMethod<
    [string, bigint, Uint8Array | number[]],
    Result_1
  >,
  'uploadMusic' : ActorMethod<
    [string, string, Uint8Array | number[], string],
    Result
  >,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
