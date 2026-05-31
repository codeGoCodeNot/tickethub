import DeleteAccountButton from "./delete-account-button";

const DeleteAccount = () => {
  return (
    <div className="flex items-center justify-between rounded-lg border border-destructive/50 p-4">
      <div>
        <p className="text-sm font-medium">Delete account</p>
        <p className="text-xs text-muted-foreground">
          Permanently delete your account and all associated data.
        </p>
      </div>
      <DeleteAccountButton />
    </div>
  );
};

export default DeleteAccount;
