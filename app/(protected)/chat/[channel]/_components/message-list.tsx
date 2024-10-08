/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from '@/type';
import MessageCard from '@/app/(protected)/chat/[channel]/_components/message-card';

interface Props {
  user: User;
  messages: any;
}

export default function MessageList({ messages, user }: Props) {
  return (
    <ul>
      {messages.map((item: any) => (
        <li key={item.id} className={`flex p-3 ${user.id === item.clientId && 'flex-row-reverse'}`}>
          <MessageCard message={item} user={user} />
        </li>
      ))}
    </ul>
  );
}
