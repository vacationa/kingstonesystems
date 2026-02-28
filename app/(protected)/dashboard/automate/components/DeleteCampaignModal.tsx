import { useState } from "react";
import { AlertTriangle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

interface DeleteCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  campaignName: string;
}

export function DeleteCampaignModal({
  isOpen,
  onClose,
  onConfirm,
  campaignName,
}: DeleteCampaignModalProps) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirm = async () => {
    setIsDeleting(true);
    try {
      await onConfirm();
      toast.success("Campaign deleted successfully");
      onClose();
    } catch (error) {
      console.error("Error deleting campaign:", error);
      toast.error("Failed to delete campaign. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md w-[95%] rounded-2xl bg-white p-0 border border-black/10 shadow-lg">
        <DialogHeader>
          <div className="flex flex-col items-start px-6 pt-6">
            <DialogTitle className="text-xl  text-black">
              Delete Campaign
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="flex flex-col gap-6 px-6 py-6">
          <div className="w-full border border-black/10 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center">
                <AlertTriangle className="h-5 w-5 text-black/80" strokeWidth={1.25} />
              </div>
              <div className="space-y-2">
                <DialogDescription className=" text-base text-black/80">
                  Are you sure you want to delete the campaign{" "}
                  <span className="font-medium">"{campaignName}"</span>?
                </DialogDescription>
                <DialogDescription className=" text-sm text-slate-500">
                  This action cannot be undone. All campaign data, connections, and logs will be
                  permanently deleted.
                </DialogDescription>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Button
              onClick={handleConfirm}
              disabled={isDeleting}
              className="w-full  text-sm py-2.5 rounded-xl"
            >
              {isDeleting ? (
                <>
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" strokeWidth={1.25} />
                  Delete Campaign
                </>
              )}
            </Button>
            <button
              onClick={onClose}
              disabled={isDeleting}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl  text-sm text-slate-600 border border-transparent hover:border-black/10 transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}