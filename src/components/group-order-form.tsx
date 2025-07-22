
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import type { FoodOrder } from "@/lib/types";
import { Separator } from "./ui/separator";
import { Textarea } from "./ui/textarea";
import { ScrollArea } from "./ui/scroll-area";
import type { StoredOrderDetails } from "@/contexts/app-context";
import { useEffect } from "react";

const formSchema = z.object({
    companyName: z.string().min(2, "Nazwa firmy musi mieć co najmniej 2 znaki."),
    description: z.string().optional(),
    link: z.string().url("Proszę wprowadzić prawidłowy adres URL.").optional().or(z.literal('')),
    creatorPhoneNumber: z.string().min(5, "Proszę wprowadzić prawidłowy numer telefonu.").optional().or(z.literal('')),
    imageUrl: z.string().url("Proszę wprowadzić prawidłowy adres URL obrazu.").optional().or(z.literal('')),
    deadline: z.string().optional(),
});

type GroupOrderFormProps = {
    onSubmit: (data: Omit<FoodOrder, 'id' | 'creatorId' | 'orders' | 'isOpen' | 'votingOptions' | 'type'> & { type: 'order' }) => void;
    onCancel: () => void;
    storedDetails?: StoredOrderDetails | null;
};

export default function GroupOrderForm({ onSubmit, onCancel, storedDetails }: GroupOrderFormProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            companyName: "",
            description: "",
            link: storedDetails?.link || "",
            creatorPhoneNumber: storedDetails?.creatorPhoneNumber || "",
            imageUrl: storedDetails?.imageUrl || "",
            deadline: "",
        },
    });

    useEffect(() => {
        if (storedDetails) {
            form.reset({
                ...form.getValues(),
                link: storedDetails.link,
                creatorPhoneNumber: storedDetails.creatorPhoneNumber,
                imageUrl: storedDetails.imageUrl,
            });
        }
    }, [storedDetails, form]);

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        const deadlineDate = values.deadline ? new Date() : undefined;
        if (deadlineDate && values.deadline) {
            const [hours, minutes] = values.deadline.split(':').map(Number);
            deadlineDate.setHours(hours, minutes, 0, 0);
        }

        onSubmit({
            ...values,
            deadline: deadlineDate?.toISOString(),
            type: 'order'
        });
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col h-full">
                <ScrollArea className="flex-grow p-1">
                    <div className="space-y-6 pr-4">
                        <FormField
                            control={form.control}
                            name="companyName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Nazwa firmy/restauracji</FormLabel>
                                    <FormControl><Input placeholder='np. Pizzeria "Szybka Pizza"' {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="deadline"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Czas zakończenia (opcjonalnie)</FormLabel>
                                    <FormControl><Input type="time" {...field} /></FormControl>
                                    <FormDescription>Po tym czasie nie będzie można dodawać nowych zamówień.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Opis (opcjonalnie)</FormLabel>
                                    <FormControl><Textarea placeholder="np. instrukcje organizacyjne, numer BLIK do płatności..." {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="link"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Link do menu</FormLabel>
                                    <FormControl><Input placeholder="https://przykladowapizza.com/menu" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="creatorPhoneNumber"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Twój numer telefonu</FormLabel>
                                    <FormControl><Input placeholder="Do koordynacji płatności" {...field} /></FormControl>
                                    <FormDescription>Twój numer będzie widoczny dla innych w tym zamówieniu.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="imageUrl"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>URL logo/obrazka (opcjonalnie)</FormLabel>
                                    <FormControl><Input placeholder="https://przyklad.com/logo.png" {...field} /></FormControl>
                                    <FormDescription>Bezpośredni link do obrazka z logo firmy.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                </ScrollArea>
                <Separator className="my-4" />
                <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={onCancel}>Anuluj</Button>
                    <Button type="submit" variant="glass">Utwórz zamówienie</Button>
                </div>
            </form>
        </Form>
    );
}
