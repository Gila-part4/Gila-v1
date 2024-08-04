'use client';

import { createAnswer } from '@/app/action/answer';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import Spinner from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { UploadButton } from '@/components/upload-button';
import { zodResolver } from '@hookform/resolvers/zod';
import { FileImage, X } from 'lucide-react';
import Image from 'next/image';
import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const FormFields = {
  name: 'content',
  label: '답변하기',
  placeholder: '답변을 입력해 주세요',
  type: 'textarea',
};

const FormSchema = z.object({
  content: z
    .string()
    .min(1, { message: '답변은 최소 1자 이상 입력해 주세요.' })
    .max(200, { message: '답변은 200자 이내로 입력해 주세요.' }),
});

export default function AnswerForm({ questionId }: { questionId: string }) {
  const [imageUrl, setImageUrl] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      content: '',
    },
  });

  const uploadImage = (url?: string) => {
    if (!url) return;
    setImageUrl([url]);
    setLoading(false);
  };

  const cancelImage = () => {
    setImageUrl([]);
  };

  const onSubmit = (values: z.infer<typeof FormSchema>) => {
    startTransition(async () => {
      const result = await createAnswer({ questionId, content: values.content, images: imageUrl });
      if (!result.success) {
        toast.error(result.message);
        return;
      }
      toast.success(result.message);
      form.setValue('content', '');
      setImageUrl([]);
    });
  };

  const customButton = () => {
    return (
      <div className="z-10 relative">
        <div className="w-[80px] border-2 border-primary rounded-md flex justify-center items-center py-2">
          <FileImage className="h-4 w-4" color="#000" />
        </div>
      </div>
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-end gap-6 w-full">
        <div className="flex flex-col gap-4 w-full">
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm">{FormFields.label}</FormLabel>
                {loading && (
                  <div className="flex justify-center items-center">
                    <Spinner />
                  </div>
                )}
                {imageUrl[0] && (
                  <div className="w-52 h-60 relative">
                    <Image
                      src={imageUrl[0]}
                      fill
                      alt="답변 이미지"
                      className="rounded-lg object-cover"
                    />
                    <X className="absolute right-1 top-1" onClick={cancelImage} />
                  </div>
                )}
                <FormControl>
                  <Textarea placeholder={FormFields.placeholder} {...field} className="text-xs" />
                </FormControl>
                <div className="h-4">
                  <FormMessage className="text-xs text-red" />
                </div>
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col items-center">
          <UploadButton
            onChange={uploadImage}
            onUploadBegin={() => setLoading(true)}
            CustomButton={customButton}
          />
          <Button disabled={isPending} type="submit" className="px-4 py-1 text-sm rounded-md mb-6">
            제출하기
          </Button>
        </div>
      </form>
    </Form>
  );
}
