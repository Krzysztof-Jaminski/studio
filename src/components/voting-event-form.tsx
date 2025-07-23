
"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import type { FoodOrder } from "@/lib/types";
import { PlusCircle, Trash2 } from "lucide-react";
import { Separator } from "./ui/separator";
import { Card } from "./ui/card";
import { Textarea } from "./ui/textarea";
import { ScrollArea } from "./ui/scroll-area";

const formSchema = z.object({
    companyName: z.string().min(2, "Tytuł musi mieć co najmniej 2 znaki."),
    description: z.string().optional(),
    deadline: z.string().optional(),
    votingOptions: z.array(z.object({
        name: z.string().min(1, "Nazwa firmy jest wymagana."),
        link: z.string().url("Proszę wprowadzić prawidłowy adres URL.").optional().or(z.literal('')),
    })).min(1, "Musisz podać co najmniej jedną opcję do głosowania.")
});

type VotingEventFormProps = {
    onSubmit: (data: Omit<FoodOrder, 'id' | 'creatorId' | 'orders' | 'isOpen' | 'type' | 'votingOptions'> & { type: 'voting', votingOptions: { name: string, link?: string }[] }) => void;
    onCancel: () => void;
};

export default function VotingEventForm({ onSubmit, onCancel }: VotingEventFormProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            companyName: "",
            description: "",
            deadline: "",
            votingOptions: [{ name: '', link: '' }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "votingOptions"
    });

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        const deadlineDate = values.deadline ? new Date() : undefined;
        if (deadlineDate && values.deadline) {
            const [hours, minutes] = values.deadline.split(':').map(Number);
            deadlineDate.setHours(hours, minutes, 0, 0);
        }

        onSubmit({
            ...values,
            deadline: deadlineDate?.toISOString(),
            type: 'voting'
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
                                <FormLabel>Tytuł głosowania</FormLabel>
                                <FormControl><Input placeholder="np. Piątkowy lunch" {...field} /></FormControl>
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
                                <FormDescription>Po tym czasie głosowanie zostanie zamknięte.</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Opis głosowania (opcjonalnie)</FormLabel>
                                <FormControl><Textarea placeholder="np. instrukcje organizacyjne, zasady głosowania" {...field} /></FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <FormLabel>Opcje do głosowania</FormLabel>
                            <Button type="button" variant="outline" size="sm" onClick={() => append({ name: '', link: '' })}>
                                <PlusCircle className="mr-2" /> Dodaj opcję
                            </Button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {fields.map((field, index) => (
                                <Card key={field.id} className="p-4 space-y-3 relative w-full bg-secondary">
                                    <h4 className="font-semibold text-white">Opcja {index + 1}</h4>
                                    <FormField
                                        control={form.control}
                                        name={`votingOptions.${index}.name`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs">Nazwa</FormLabel>
                                                <FormControl><Input placeholder="np. Sushi World" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name={`votingOptions.${index}.link`}
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel className="text-xs">Link do menu (opcjonalnie)</FormLabel>
                                                <FormControl><Input placeholder="https://sushiworld.com/menu" {...field} /></FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    {fields.length > 1 && (
                                        <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 text-muted-foreground hover:bg-red-500/20 hover:text-red-400" onClick={() => remove(index)}>
                                            <Trash2 />
                                        </Button>
                                    )}
                                </Card>
                            ))}
                        </div>
                        <FormField
                            control={form.control}
                            name="votingOptions"
                            render={() => (
                                <FormItem>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                 </div>
                </ScrollArea>
                <Separator className="my-4" />
                <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={onCancel}>Anuluj</Button>
                    <Button type="submit" variant="glass">Utwórz głosowanie</Button>
                </div>
            </form>
        </Form>
    );
}

    
