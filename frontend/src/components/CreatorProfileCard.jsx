const CreatorProfileCard = ({ user }) => {
  const avatar = "https://api.dicebear.com/7.x/adventurer/svg?seed=creator1";
  return (
    <div className="glass-card p-5">
      <div className="flex items-center gap-4">
        <img src={avatar} alt="Creator avatar" className="h-20 w-20 rounded-full border-2 border-indigo-200 bg-white" />
        <div>
          <h3 className="text-lg font-bold text-slate-900">{user?.name || "Demo Creator"}</h3>
          <p className="text-sm text-slate-600">{user?.email || "creator@test.com"}</p>
        </div>
      </div>
      <div className="mt-4 space-y-2 text-sm text-slate-700">
        <p><span className="font-semibold">Contact:</span> +91 98765 43210</p>
        <p><span className="font-semibold">Bio:</span> Content creator focused on authentic engagement analytics.</p>
      </div>
    </div>
  );
};

export default CreatorProfileCard;
