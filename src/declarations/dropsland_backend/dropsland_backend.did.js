export const idlFactory = ({ IDL }) => {
  const Result_1 = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  const Time = IDL.Int;
  const Drop = IDL.Record({
    'id' : IDL.Nat,
    'title' : IDL.Text,
    'createdAt' : Time,
    'creatorId' : IDL.Principal,
    'description' : IDL.Text,
  });
  const Result_7 = IDL.Variant({ 'ok' : Drop, 'err' : IDL.Text });
  const Result = IDL.Variant({ 'ok' : IDL.Text, 'err' : IDL.Text });
  const User = IDL.Record({
    'id' : IDL.Principal,
    'username' : IDL.Text,
    'createdAt' : Time,
  });
  const Result_6 = IDL.Variant({ 'ok' : User, 'err' : IDL.Text });
  const MusicMetadata = IDL.Record({
    'id' : IDL.Text,
    'contentType' : IDL.Text,
    'name' : IDL.Text,
    'size' : IDL.Nat,
    'artist' : IDL.Text,
    'uploadedAt' : Time,
    'uploadedBy' : IDL.Principal,
  });
  const Result_5 = IDL.Variant({ 'ok' : IDL.Vec(IDL.Nat8), 'err' : IDL.Text });
  const MusicFile = IDL.Record({
    'id' : IDL.Text,
    'contentType' : IDL.Text,
    'data' : IDL.Vec(IDL.Nat8),
    'name' : IDL.Text,
    'size' : IDL.Nat,
    'artist' : IDL.Text,
    'uploadedAt' : Time,
    'uploadedBy' : IDL.Principal,
  });
  const Result_4 = IDL.Variant({ 'ok' : MusicFile, 'err' : IDL.Text });
  const Result_3 = IDL.Variant({ 'ok' : MusicMetadata, 'err' : IDL.Text });
  const UploadSession = IDL.Record({
    'id' : IDL.Text,
    'expiresAt' : Time,
    'uploadedChunks' : IDL.Nat,
    'contentType' : IDL.Text,
    'name' : IDL.Text,
    'createdAt' : Time,
    'totalSize' : IDL.Nat,
    'totalChunks' : IDL.Nat,
    'artist' : IDL.Text,
    'uploadedBy' : IDL.Principal,
  });
  const Result_2 = IDL.Variant({ 'ok' : UploadSession, 'err' : IDL.Text });
  return IDL.Service({
    'cancelUpload' : IDL.Func([IDL.Text], [Result_1], []),
    'createDrop' : IDL.Func([IDL.Text, IDL.Text], [Result_7], []),
    'createUploadSession' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Text, IDL.Nat, IDL.Nat],
        [Result],
        [],
      ),
    'createUser' : IDL.Func([IDL.Text], [Result_6], []),
    'deleteMusic' : IDL.Func([IDL.Text], [Result_1], []),
    'finalizeUpload' : IDL.Func([IDL.Text], [Result], []),
    'getAllDrops' : IDL.Func([], [IDL.Vec(Drop)], ['query']),
    'getAllMusicMetadata' : IDL.Func([], [IDL.Vec(MusicMetadata)], ['query']),
    'getCanisterStatus' : IDL.Func([], [IDL.Text], ['query']),
    'getDrop' : IDL.Func([IDL.Nat], [IDL.Opt(Drop)], ['query']),
    'getMusicData' : IDL.Func([IDL.Text], [Result_5], ['query']),
    'getMusicFile' : IDL.Func([IDL.Text], [Result_4], ['query']),
    'getMusicMetadata' : IDL.Func([IDL.Text], [Result_3], ['query']),
    'getMusicStats' : IDL.Func(
        [],
        [IDL.Record({ 'totalFiles' : IDL.Nat, 'totalSize' : IDL.Nat })],
        ['query'],
      ),
    'getUploadSession' : IDL.Func([IDL.Text], [Result_2], ['query']),
    'getUser' : IDL.Func([IDL.Principal], [IDL.Opt(User)], ['query']),
    'uploadChunk' : IDL.Func(
        [IDL.Text, IDL.Nat, IDL.Vec(IDL.Nat8)],
        [Result_1],
        [],
      ),
    'uploadMusic' : IDL.Func(
        [IDL.Text, IDL.Text, IDL.Vec(IDL.Nat8), IDL.Text],
        [Result],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
