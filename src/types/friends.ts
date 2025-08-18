export interface Friends {
  plyf_id: number;
  plyf_frnd_id: number;
  plyf_kids_id: number;
  plyf_created: string; 
  plyf_modified: string; 
  plyf_status: number;
  frnd_id: number;
  frnd_fname: string;
  frnd_lname: string;
  frnd_phone: string;
  frnd_email: string;
  frnd_status: number;
  kids_name: string;
  friends_name: string;
  hash_id: string;
}

export interface FriendPayload {
    frnd_id : number | null;
    plyf_kids_id : number | null;
    frnd_fname: string;
    frnd_lname : string;
    frnd_social_link: string;
    frnd_email :string;
    frnd_phone:string;
    frnd_address:string;
}


