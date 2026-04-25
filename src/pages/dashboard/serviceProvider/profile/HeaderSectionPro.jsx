import { useState, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Eye, Pen } from "lucide-react";
import { updateProfileApi } from "@/services/api";

export default function HeaderSectionPro({
  isEditable,
  setIsEditable,
  setUserData,
  userData,
}) {
  const [name, setName] = useState(userData?.name || "Alex Rivera");
  const [email, setEmail] = useState(userData?.email || "alex@example.com");
  const [image, setImage] = useState(`${import.meta.env.VITE_IMAGE_API}/${userData?.profilePicture}`);
  const [fileData, setFileData] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Sync local states when userData changes from parent
  useEffect(() => {
    if (userData) {
      setName(userData.name || "Alex Rivera");
      setEmail(userData.email || "alex@example.com");
      if (userData.profilePicture) {
        setImage(`${import.meta.env.VITE_IMAGE_API}/${userData?.profilePicture}`);
      }
    }
  }, [userData]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Cleanup old preview URL if exists
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setFileData(file);
    const newPreviewUrl = URL.createObjectURL(file);
    setPreviewUrl(newPreviewUrl);
    setImage(newPreviewUrl);
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      if (fileData) {
        formData.append("profilePicture", fileData);
      }

      const res = await updateProfileApi(formData); // axios response

      // 🔥 FIX: Actual response is inside res.data
      const backendRes = res.data;
      if (backendRes.success) {
        setUserData(backendRes.data); // backend se updated user
        setIsEditable(false);

        // Agar new profilePicture aayi hai toh local image update karo
        if (backendRes.data?.profilePicture) {
          setImage(backendRes.data.profilePicture);
        }
        // Cleanup preview URL after successful upload
        if (previewUrl) {
          URL.revokeObjectURL(previewUrl);
          setPreviewUrl(null);
          setFileData(null);
        }
      } else {
        console.error("Update failed:", backendRes.message);
      }
    } catch (error) {
      console.error("Update Error:", error);
    }
  };
  console.log(userData)
console.log(`${import.meta.env.VITE_IMAGE_API}/${userData?.profilePicture}`)
  // Cleanup preview URL on unmount
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  return (
    <div className="flex flex-row-reverse items-start justify-between">
      <div>
        {!isEditable ? (
          <Button type="button" onClick={() => setIsEditable(true)} className="cursor-pointer w-24 py-2">
            <Pen />
          </Button>
        ) : (
          <Button type="button" onClick={handleSubmit} className="cursor-pointer w-24 py-2">
            Save
          </Button>
        )}
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="h-14 w-14">
              <AvatarImage src={image} />
              <AvatarFallback>AR</AvatarFallback>
            </Avatar>
            {isEditable && (
              <label className="absolute inset-0 cursor-pointer bg-black/40 rounded-full flex items-center justify-center text-white text-xs opacity-0 hover:opacity-100 transition">
                Change
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </label>
            )}
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-teal-600 text-sm font-medium uppercase tracking-wide">Welcome Back</p>
            {isEditable ? (
              <>
                <Input value={name} onChange={(e) => setName(e.target.value)} className="h-8 text-lg font-bold" />
                <Input value={email} onChange={(e) => setEmail(e.target.value)} className="h-8 text-sm" />
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold">{name}</h2>
                <p className="text-sm text-muted-foreground">{email}</p>
              </>
            )}
          </div>
        </div>

        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}