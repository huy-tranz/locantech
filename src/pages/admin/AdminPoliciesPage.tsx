import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { type PolicyItem, getAllPolicies, saveAllPolicies } from "@/data/policies";
import { Plus, Pencil, Trash2 } from "lucide-react";

type PolicyForm = PolicyItem;

const emptySection = { heading: "", content: "" };

const emptyPolicy: PolicyForm = {
  slug: "",
  title: "",
  lastUpdated: "",
  sections: [{ ...emptySection }],
};

function normalizeSlug(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");
}

export default function AdminPoliciesPage() {
  const [policies, setPolicies] = useState<PolicyItem[]>(() => getAllPolicies());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<PolicyForm | null>(null);

  const persist = (next: PolicyItem[]) => {
    setPolicies(next);
    saveAllPolicies(next);
  };

  const openCreate = () => {
    setEditing({ ...emptyPolicy, sections: [{ ...emptySection }] });
    setDialogOpen(true);
  };

  const openEdit = (policy: PolicyItem) => {
    setEditing({
      ...policy,
      sections: policy.sections.map((section) => ({ ...section })),
    });
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (!editing) return;

    const title = editing.title.trim();
    const slug = normalizeSlug(editing.slug || editing.title);
    const lastUpdated = editing.lastUpdated.trim();
    const sections = editing.sections
      .map((section) => ({
        heading: section.heading.trim(),
        content: section.content.trim(),
      }))
      .filter((section) => section.heading && section.content);

    if (!title || !slug || !lastUpdated || sections.length === 0) {
      toast({
        title: "Thiếu nội dung chính sách",
        description: "Vui lòng nhập tiêu đề, slug, ngày cập nhật và ít nhất 1 section hợp lệ.",
        variant: "destructive",
      });
      return;
    }

    const duplicate = policies.find((policy) => policy.slug === slug && policy.slug !== editing.slug);
    if (duplicate) {
      toast({
        title: "Slug đã tồn tại",
        description: "Vui lòng chọn slug khác cho chính sách này.",
        variant: "destructive",
      });
      return;
    }

    const payload: PolicyItem = {
      slug,
      title,
      lastUpdated,
      sections,
    };

    const next = policies.some((policy) => policy.slug === editing.slug)
      ? policies.map((policy) => (policy.slug === editing.slug ? payload : policy))
      : [...policies, payload];

    persist(next);
    setDialogOpen(false);
    toast({ title: editing.slug ? "Đã cập nhật chính sách" : "Đã thêm chính sách" });
  };

  const handleDelete = (slug: string) => {
    const policy = policies.find((item) => item.slug === slug);
    if (!policy) return;
    if (!window.confirm(`Xóa chính sách "${policy.title}"?`)) return;

    persist(policies.filter((item) => item.slug !== slug));
    toast({ title: "Đã xóa chính sách" });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-foreground">Quản lý chính sách</h1>
        <Button onClick={openCreate}>
          <Plus className="mr-1 h-4 w-4" />
          Thêm chính sách
        </Button>
      </div>

      <div className="grid gap-4">
        {policies.map((policy) => (
          <Card key={policy.slug}>
            <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-start md:justify-between">
              <div className="min-w-0">
                <p className="text-lg font-semibold text-foreground">{policy.title}</p>
                <p className="mt-1 text-xs font-mono text-muted-foreground">/{policy.slug}</p>
                <p className="mt-2 text-sm text-muted-foreground">Cập nhật: {policy.lastUpdated}</p>
                <p className="mt-2 text-sm text-muted-foreground">{policy.sections.length} section nội dung</p>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => openEdit(policy)}>
                  <Pencil className="mr-1 h-4 w-4" />
                  Sửa
                </Button>
                <Button variant="outline" className="text-destructive" onClick={() => handleDelete(policy.slug)}>
                  <Trash2 className="mr-1 h-4 w-4" />
                  Xóa
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{editing?.slug ? "Sửa chính sách" : "Thêm chính sách"}</DialogTitle>
          </DialogHeader>

          {editing && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2 md:col-span-2">
                  <Label>Tiêu đề</Label>
                  <Input
                    value={editing.title}
                    onChange={(event) =>
                      setEditing((current) =>
                        current
                          ? {
                              ...current,
                              title: event.target.value,
                              slug: current.slug || normalizeSlug(event.target.value),
                            }
                          : current
                      )
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cập nhật</Label>
                  <Input
                    value={editing.lastUpdated}
                    onChange={(event) => setEditing((current) => (current ? { ...current, lastUpdated: event.target.value } : current))}
                    placeholder="23/04/2026"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Slug</Label>
                <Input
                  value={editing.slug}
                  onChange={(event) =>
                    setEditing((current) => (current ? { ...current, slug: normalizeSlug(event.target.value) } : current))
                  }
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Sections</Label>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      setEditing((current) =>
                        current ? { ...current, sections: [...current.sections, { ...emptySection }] } : current
                      )
                    }
                  >
                    <Plus className="mr-1 h-4 w-4" />
                    Thêm section
                  </Button>
                </div>

                {editing.sections.map((section, index) => (
                  <div key={`${editing.slug || "new"}-${index}`} className="rounded-2xl border p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <p className="font-medium text-foreground">Section {index + 1}</p>
                      {editing.sections.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          className="text-destructive"
                          onClick={() =>
                            setEditing((current) =>
                              current
                                ? {
                                    ...current,
                                    sections: current.sections.filter((_, sectionIndex) => sectionIndex !== index),
                                  }
                                : current
                            )
                          }
                        >
                          <Trash2 className="mr-1 h-4 w-4" />
                          Xóa
                        </Button>
                      )}
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label>Heading</Label>
                        <Input
                          value={section.heading}
                          onChange={(event) =>
                            setEditing((current) =>
                              current
                                ? {
                                    ...current,
                                    sections: current.sections.map((item, sectionIndex) =>
                                      sectionIndex === index ? { ...item, heading: event.target.value } : item
                                    ),
                                  }
                                : current
                            )
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label>Content</Label>
                        <Textarea
                          rows={5}
                          value={section.content}
                          onChange={(event) =>
                            setEditing((current) =>
                              current
                                ? {
                                    ...current,
                                    sections: current.sections.map((item, sectionIndex) =>
                                      sectionIndex === index ? { ...item, content: event.target.value } : item
                                    ),
                                  }
                                : current
                            )
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Hủy
                </Button>
                <Button onClick={handleSave}>Lưu chính sách</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
