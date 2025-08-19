import React, { useEffect } from 'react'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Loader2 } from 'lucide-react'
import { FriendPayload, Friends } from '@/types/friends'

interface FriendFormProps {
    isEdit?: boolean;
    handleCloseModel: ()=>void;
    editFriend?: Friends | null;
    handleAddFriend: (close: React.Dispatch<React.SetStateAction<boolean>>) => void;
    newFriend: FriendPayload;
    kids: any[];
    errors: Record<string, string>;
    submitting: boolean;
    handleValueChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    handleSetFriend: any;
}

export const ParentForm: React.FC<FriendFormProps> = ({
    isEdit = false,
    handleCloseModel,
    handleValueChange,
    newFriend,
    kids,
    errors,
    submitting,
    editFriend = null,
    handleAddFriend,
    handleSetFriend
}) => {
  
    useEffect(() => {
        handleSetFriend(editFriend)
    }, [editFriend])

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                    <Label htmlFor="frnd_fname">First Name</Label>
                    <Input
                        id="frnd_fname"
                        name="frnd_fname"
                        value={newFriend.frnd_fname || ""}
                        onChange={handleValueChange}
                        placeholder="First name"
                    />
                    {errors.frnd_fname && (
                        <p className="text-red-500 text-sm">{errors.frnd_fname}</p>
                    )}
                </div>
                <div className="space-y-3">
                    <Label htmlFor="frnd_lname">Last Name</Label>
                    <Input
                        id="frnd_lname"
                        name="frnd_lname"
                        value={newFriend.frnd_lname || ""}
                        onChange={handleValueChange}
                        placeholder="Last name"
                    />
                    {errors.frnd_lname && (
                        <p className="text-red-500 text-sm">{errors.frnd_lname}</p>
                    )}
                </div>
            </div>

            <div className="space-y-3">
                <Label htmlFor="frnd_email">Email</Label>
                <Input
                    id="frnd_email"
                    name="frnd_email"
                    type="email"
                    value={newFriend.frnd_email}
                    onChange={handleValueChange}
                    placeholder="Email address"
                />
                {errors.frnd_email && (
                    <p className="text-red-500 text-sm">{errors.frnd_email}</p>
                )}
            </div>

            <div className="space-y-3">
                <Label htmlFor="frnd_phone">Mobile</Label>
                <Input
                    id="frnd_phone"
                    name="frnd_phone"
                    type="tel"
                    value={newFriend.frnd_phone}
                    onChange={handleValueChange}
                    placeholder="Mobile number"
                />
                {errors.frnd_phone && (
                    <p className="text-red-500 text-sm">{errors.frnd_phone}</p>
                )}
            </div>

            <div className="space-y-3">
                <Label htmlFor="relationship">Relationship</Label>
                <Input
                    id="relationship"
                    name="relationship"
                    type="url"
                    value={newFriend.frnd_social_link}
                    onChange={handleValueChange}
                    placeholder="Social media link"
                />
                {errors.frnd_social_link && (
                    <p className="text-red-500 text-sm">{errors.frnd_social_link}</p>
                )}
            </div>

            <div className="space-y-3">
                <Label htmlFor="frnd_address">Address</Label>
                <Input
                    id="frnd_address"
                    name="frnd_address"
                    value={newFriend.frnd_address}
                    onChange={handleValueChange}
                    placeholder="Address"
                />
                {errors.frnd_address && (
                    <p className="text-red-500 text-sm">{errors.frnd_address}</p>
                )}
            </div>

            <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                    <Label>Kids</Label>
                    <select
                        id="className"
                        name="plyf_kids_id"
                        value={newFriend.plyf_kids_id || "null"}
                        onChange={handleValueChange}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    >
                        <option value="null">Select Kids</option>
                        {kids.length > 0 &&
                            kids.map((kid: any, index: number) => (
                                <option key={index} value={kid.kids_id}>
                                    {kid.kids_lname
                                        ? `${kid.kids_fname} ${kid.kids_lname}`
                                        : kid.kids_fname}
                                </option>
                            ))}
                    </select>
                    {errors.plyf_kids_id && (
                        <p className="text-red-500 text-sm">{errors.plyf_kids_id}</p>
                    )}
                </div>
            </div>

            <div className="flex justify-end gap-2">
                <Button
                    variant="outline"
                    onClick={() => handleCloseModel()}
                    disabled={submitting}
                >
                    Cancel
                </Button>
                <Button
                    onClick={() => handleAddFriend(handleCloseModel)}
                    disabled={submitting}
                >
                    {submitting ? (
                        <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            {isEdit ? 'Editing...' : 'Adding...'}
                        </>
                    ) : (
                        isEdit ? 'Edit Friend' : 'Add Friend'
                    )}
                </Button>
            </div>
        </div>
    )
}
