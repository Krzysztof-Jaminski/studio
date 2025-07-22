
"use client";

import { useForm, Controller, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription } from "@/components/ui/form";
import type { FoodOrder } from "@/lib/types";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { PlusCircle, Trash2 } from "lucide-react";
import { Separator } from "./ui/separator";
import { Card } from "./ui/card";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "./ui/carousel";
import { cn } from "@/lib/utils";
import { Textarea } from "./ui/textarea";

const formSchema = z.object({
    type: z.enum(['order', 'voting'], { required_error: "You must select an event type."}),
    companyName: z.string().min(2, "Title must be at least 2 characters."),
    description: z.string().optional(),
    link: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
    creatorPhoneNumber: z.string().min(5, "Please enter a valid phone number.").optional().or(z.literal('')),
    imageUrl: z.string().url("Please enter a valid image URL.").optional().or(z.literal('')),
    deadline: z.string().optional(),
    votingOptions: z.array(z.object({
        name: z.string().min(1, "Company name is required."),
        link: z.string().url("Please enter a valid URL.").optional().or(z.literal('')),
        imageUrl: z.string().url("A valid image URL is required.").optional().or(z.literal(''))
    })).min(1, "You must provide at least one voting option.").optional()
});

type FoodOrderFormProps = {
    onSubmit: (data: Omit<FoodOrder, 'id' | 'creatorId' | 'orders' | 'isOpen' | 'votingOptions'> & { votingOptions?: { name: string, link?: string, imageUrl?: string }[] }) => void;
    onCancel: () => void;
};

export default function FoodOrderForm({ onSubmit, onCancel }: FoodOrderFormProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            type: "order",
            companyName: "",
            description: "",
            link: "",
            creatorPhoneNumber: "",
            imageUrl: "",
            deadline: "",
            votingOptions: [{ name: '', link: '', imageUrl: '' }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "votingOptions"
    });

    const eventType = form.watch("type");

    const handleSubmit = (values: z.infer<typeof formSchema>) => {
        const deadlineDate = values.deadline ? new Date() : undefined;
        if (deadlineDate && values.deadline) {
            const [hours, minutes] = values.deadline.split(':').map(Number);
            deadlineDate.setHours(hours, minutes, 0, 0);
        }

        const dataToSubmit = {
            ...values,
            deadline: deadlineDate?.toISOString()
        };

        if (values.type === 'order') {
            const { votingOptions, description, ...orderData } = dataToSubmit;
            onSubmit(orderData);
        } else {
             const { link, creatorPhoneNumber, imageUrl, ...votingData } = dataToSubmit;
             onSubmit(votingData);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem className="space-y-3">
                            <FormLabel>Event Type</FormLabel>
                            <FormControl>
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="flex space-x-4"
                                >
                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                        <FormControl><RadioGroupItem value="order" /></FormControl>
                                        <FormLabel className="font-normal">Direct Order</FormLabel>
                                    </FormItem>
                                    <FormItem className="flex items-center space-x-2 space-y-0">
                                        <FormControl><RadioGroupItem value="voting" /></FormControl>
                                        <FormLabel className="font-normal">Restaurant Voting</FormLabel>
                                    </FormItem>
                                </RadioGroup>
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="companyName" // Used as a title for both
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{eventType === 'order' ? 'Company/Restaurant Name' : 'Voting Title'}</FormLabel>
                            <FormControl><Input placeholder={eventType === 'order' ? 'e.g., Pizza Palace' : 'e.g., Friday Lunch'} {...field} /></FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="deadline"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>End Time (optional)</FormLabel>
                            <FormControl><Input type="time" {...field} /></FormControl>
                            <FormDescription>
                                {eventType === 'order' ? 'After this time, no more orders can be added.' : 'After this time, voting will be closed.'}
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />


                {eventType === 'order' ? (
                    <>
                        <FormField
                            control={form.control}
                            name="link"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Menu Link</FormLabel>
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
                                    <FormLabel>Logo/Image URL (optional)</FormLabel>
                                    <FormControl><Input placeholder="https://example.com/logo.png" {...field} /></FormControl>
                                    <FormDescription>Direct link to the company's logo image.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </>
                ) : (
                    <>
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Voting Description (optional)</FormLabel>
                                    <FormControl><Textarea placeholder="e.g., organizational instructions, BLIK number for payment, order information" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <FormLabel>Voting Options</FormLabel>
                                <Button type="button" variant="outline" size="sm" onClick={() => append({ name: '', link: '', imageUrl: '' })}>
                                    <PlusCircle className="mr-2" /> Add Option
                                </Button>
                            </div>
                            <Carousel className="w-full">
                                <CarouselContent>
                                    {fields.map((field, index) => (
                                        <CarouselItem key={field.id}>
                                            <Card className="p-4 space-y-3 relative w-full whitespace-normal bg-secondary">
                                                <h4 className="font-semibold">Option {index + 1}</h4>
                                                <FormField
                                                    control={form.control}
                                                    name={`votingOptions.${index}.name`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-xs">Name</FormLabel>
                                                            <FormControl><Input placeholder="e.g., Sushi World" {...field} /></FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name={`votingOptions.${index}.link`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-xs">Menu Link (optional)</FormLabel>
                                                            <FormControl><Input placeholder="https://sushiworld.com/menu" {...field} /></FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name={`votingOptions.${index}.imageUrl`}
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-xs">Image URL (optional)</FormLabel>
                                                            <FormControl><Input placeholder="https://sushiworld.com/logo.png" {...field} /></FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                {fields.length > 1 && (
                                                    <Button type="button" variant="ghost" size="icon" className="absolute top-2 right-2 text-muted-foreground hover:bg-accent/20 hover:text-accent" onClick={() => remove(index)}>
                                                        <Trash2 />
                                                    </Button>
                                                )}
                                            </Card>
                                        </CarouselItem>
                                    ))}
                                </CarouselContent>
                                <CarouselPrevious />
                                <CarouselNext />
                            </Carousel>
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
                    </>
                )}


                <Separator />
                <div className="flex justify-end gap-2">
                    <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
                    <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground">
                        Create Event
                    </Button>
                </div>
            </form>
        </Form>
    );
}
