"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import type { PortfolioItem } from "@/lib/types";

const formSchema = z.object({
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  description: z.string().min(10, { message: "Description must be at least 10 characters." }),
  link: z.string().url().optional().or(z.literal('')),
  technologies: z.string().optional(),
  isVisible: z.boolean().default(true),
});

type PortfolioItemFormProps = {
  item?: PortfolioItem;
  onSubmit: (data: PortfolioItem) => void;
  onCancel: () => void;
};

export default function PortfolioItemForm({ item, onSubmit, onCancel }: PortfolioItemFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: item?.title || "",
      description: item?.description || "",
      link: item?.link || "",
      technologies: item?.technologies?.join(", ") || "",
      isVisible: item?.isVisible ?? true,
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    const submittedItem: PortfolioItem = {
      id: item?.id || `proj-${Date.now()}`,
      type: 'project',
      title: values.title,
      description: values.description,
      link: values.link,
      technologies: values.technologies?.split(',').map(t => t.trim()).filter(Boolean) || [],
      date: item?.date || new Date().toISOString(),
      isVisible: values.isVisible,
    };
    onSubmit(submittedItem);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Project Awesome" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea placeholder="A brief description of your project." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link</FormLabel>
              <FormControl>
                <Input placeholder="https://github.com/user/repo" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="technologies"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Technologies</FormLabel>
              <FormControl>
                <Input placeholder="React, Next.js, Tailwind CSS" {...field} />
              </FormControl>
              <FormDescription>
                Comma-separated list of technologies.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isVisible"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Visible in Portfolio
                </FormLabel>
                <FormDescription>
                  Make this item visible to others on your profile.
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
            <Button type="submit">Save Project</Button>
        </div>
      </form>
    </Form>
  );
}
