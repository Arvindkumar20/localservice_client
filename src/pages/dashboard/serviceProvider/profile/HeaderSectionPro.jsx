import { useState } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bell, Eye, Pen } from "lucide-react";

export default function HeaderSectionPro({
  isEditable,
  setIsEditable,
  setUserData,
  userData,
}) {
  const [name, setName] = useState(userData.name || "Alex Rivera");
  const [email, setEmail] = useState(userData.email || "alex@example.com");
  const [image, setImage] = useState(
    "https://static.vecteezy.com/vite/assets/photo-masthead-375-BoK_p8LG.webp",
  );
  console.log(userData);
  const [fileData, setFileData] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileData(file);
    const previewUrl = URL.createObjectURL(file);
    setImage(previewUrl);

    // Later: upload file to server here
  };

  const handleSubmit = () => {
    setUserData({
      ...userData,
      name: name,
      email: email,
      image: fileData,
    });
  };
  return (
    <div className="flex flex-row-reverse items-start justify-between">
      <div>
        {!isEditable ? (
          <Button
            type="button"
            onClick={() => setIsEditable(!isEditable)}
            className={"cursor-pointer w-24 py-2"}
          >
            <Pen />
          </Button>
        ) : (
          <Button
            type="button"
            onClick={handleSubmit}
            className={"cursor-pointer w-24 py-2"}
          >
            Save
          </Button>
        )}
      </div>
      <div className="flex items-center justify-between">
        {/* LEFT SIDE */}
        <div className="flex items-center gap-4">
          {/* Avatar */}
          <div className="relative">
            <Avatar className="h-14 w-14">
              <AvatarImage src={image} />
              <AvatarFallback>AR</AvatarFallback>
            </Avatar>

            {isEditable && (
              <label className="absolute inset-0 cursor-pointer bg-black/40 rounded-full flex items-center justify-center text-white text-xs opacity-0 hover:opacity-100 transition">
                Change
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
            )}
          </div>

          {/* Name + Email */}
          <div className="flex flex-col gap-1">
            <p className="text-teal-600 text-sm font-medium uppercase tracking-wide">
              Welcome Back
            </p>

            {isEditable ? (
              <>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-8 text-lg font-bold"
                />
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-8 text-sm"
                />
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold">{name}</h2>
                <p className="text-sm text-muted-foreground">{email}</p>
              </>
            )}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell className="w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}
