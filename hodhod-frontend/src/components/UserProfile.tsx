interface UserProfileProps {
  name: string;
}

export default function UserProfile({ name }: UserProfileProps) {
  const initial = name.charAt(0);

  return (
    <div className="flex items-center gap-2">
      <div className="w-9 h-9 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-sm">
        {initial}
      </div>
      <span className="text-sm font-medium text-text-primary hidden sm:block">{name}</span>
    </div>
  );
}