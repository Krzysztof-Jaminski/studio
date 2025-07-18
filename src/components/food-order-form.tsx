
"use client";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import type { FoodOrder } from "@/lib/types";

const formSchema = z.object({
    companyName: z.string().min(2, "Company name must be at least 2 characters."),
    link: z.string().url("Please enter a valid URL."),
    creatorPhoneNumber: z.string().min(5, "Please enter a valid phone number."),
    imageUrl: z.string().url("Please enter a valid image URL.").optional().or(z.literal('')),
});

type FoodOrderFormProps = {
    onSubmit: (data: Omit<FoodOrder, 'id' | 'creatorId' | 'orders' | 'isOpen'>) => void;
    onCancel: () => void;
};

export default function FoodOrderForm({ onSubmit, onCancel }: FoodOrderFormProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            companyName: "",
            link: "",
            creatorPhoneNumber: "",
            imageUrl: "",
        },
    });

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        onSubmit(values);
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="companyName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Company/Restaurant Name</FormLabel>
                            <FormControl><Input placeholder="e.g., Pizza Palace" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="link"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Link to Menu</FormLabel>
                            <FormControl><Input placeholder="https://pizzapalace.com/menu" {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                 <FormField
                    control={form.control}
                    name="creatorPhoneNumber"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Your Phone Number</FormLabel>
                            <FormControl><Input placeholder="For payment coordination" {...field} /></FormControl>
                             <FormDescription>Your number will be visible to others in this order.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Logo/Image URL (Optional)</FormLabel>
                            <FormControl><Input placeholder="https://example.com/logo.png" {...field} /></FormControl>
                            <FormDescription>A direct link to an image of the company's logo.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
                    <Button type="submit">Create Order Event</Button>
                </div>
            </form>
        </Form>
    );
}
