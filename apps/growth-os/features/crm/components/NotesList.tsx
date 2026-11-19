"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { createNoteAction, deleteNoteAction, updateNoteAction } from "../services/actions";
import type { LeadNote } from "@/repositories/notes/notes.repository";
import { formatRelativeTime } from "@/utils/format";
import { Pin, Trash2, Plus, PinOff } from "lucide-react";
import { cn } from "@/utils/cn";

interface NotesListProps {
  leadId: string;
  initialNotes: LeadNote[];
}

export function NotesList({ leadId, initialNotes }: NotesListProps) {
  const [notes, setNotes] = useState(initialNotes);
  const [newContent, setNewContent] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleAdd = () => {
    if (!newContent.trim()) return;
    const content = newContent.trim();
    startTransition(async () => {
      const result = await createNoteAction(leadId, content);
      if (result.success) {
        toast.success("Note added.");
        setNewContent("");
        // Optimistic: add note to top
        setNotes((prev) => [
          {
            id: crypto.randomUUID(),
            lead_id: leadId,
            content,
            is_pinned: false,
            created_by: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          ...prev,
        ]);
      } else {
        toast.error(result.error ?? "Failed to add note.");
      }
    });
  };

  const handlePin = (note: LeadNote) => {
    startTransition(async () => {
      const result = await updateNoteAction(note.id, leadId, { is_pinned: !note.is_pinned });
      if (result.success) {
        setNotes((prev) =>
          prev.map((n) => n.id === note.id ? { ...n, is_pinned: !n.is_pinned } : n)
        );
      } else {
        toast.error("Failed to update note.");
      }
    });
  };

  const handleDelete = (noteId: string) => {
    startTransition(async () => {
      const result = await deleteNoteAction(noteId, leadId);
      if (result.success) {
        toast.success("Note deleted.");
        setNotes((prev) => prev.filter((n) => n.id !== noteId));
      } else {
        toast.error("Failed to delete note.");
      }
    });
  };

  const pinned = notes.filter((n) => n.is_pinned);
  const unpinned = notes.filter((n) => !n.is_pinned);

  return (
    <div className="space-y-4">
      {/* Add Note */}
      <div className="space-y-2">
        <Textarea
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          placeholder="Add an internal note…"
          rows={2}
          className="resize-none"
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleAdd();
          }}
        />
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">⌘+Enter to submit</p>
          <Button
            size="sm"
            onClick={handleAdd}
            disabled={!newContent.trim() || isPending}
          >
            <Plus className="mr-1.5 h-3.5 w-3.5" />
            Add Note
          </Button>
        </div>
      </div>

      {/* Pinned Notes */}
      {pinned.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Pinned
          </p>
          {pinned.map((note) => (
            <NoteCard key={note.id} note={note} onPin={handlePin} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {/* All Notes */}
      {unpinned.length > 0 && (
        <div className="space-y-2">
          {pinned.length > 0 && (
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Notes
            </p>
          )}
          {unpinned.map((note) => (
            <NoteCard key={note.id} note={note} onPin={handlePin} onDelete={handleDelete} />
          ))}
        </div>
      )}

      {notes.length === 0 && (
        <p className="py-4 text-center text-sm text-muted-foreground">
          No notes yet. Add one above.
        </p>
      )}
    </div>
  );
}

function NoteCard({
  note, onPin, onDelete,
}: {
  note: LeadNote;
  onPin: (note: LeadNote) => void;
  onDelete: (id: string) => void;
}) {
  return (
    <div
      className={cn(
        "group relative rounded-md border p-3",
        note.is_pinned
          ? "border-amber-200 bg-amber-50"
          : "border-border bg-muted/20"
      )}
    >
      <p className="text-sm text-foreground whitespace-pre-wrap">{note.content}</p>
      <div className="mt-2 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{formatRelativeTime(note.created_at)}</span>
        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
          <button
            onClick={() => onPin(note)}
            className="rounded p-1 hover:bg-background"
            title={note.is_pinned ? "Unpin" : "Pin"}
          >
            {note.is_pinned ? (
              <PinOff className="h-3.5 w-3.5 text-amber-600" />
            ) : (
              <Pin className="h-3.5 w-3.5 text-muted-foreground" />
            )}
          </button>
          <button
            onClick={() => onDelete(note.id)}
            className="rounded p-1 hover:bg-background"
            title="Delete"
          >
            <Trash2 className="h-3.5 w-3.5 text-red-500" />
          </button>
        </div>
      </div>
    </div>
  );
}
