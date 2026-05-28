import Link from "next/link";
import { Plus, Share2 } from "lucide-react";

import { PageShell } from "@/components/app/page-shell";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";

export default function ProofPacksPage() {
  return (
    <PageShell
      title="Proof Packs"
      description="Proof-pack list placeholder for time-limited public share links, recipient labels, selected documents, and watermark metadata."
      actions={
        <Button asChild>
          <Link href="/app/proof-packs/new">
            <Plus className="h-4 w-4" aria-hidden="true" />
            New proof pack
          </Link>
        </Button>
      }
    >
      <EmptyState
        icon={Share2}
        title="No proof packs created"
        description="After the vault and proof-pack data model are connected, generated share links will appear here."
      />
    </PageShell>
  );
}
