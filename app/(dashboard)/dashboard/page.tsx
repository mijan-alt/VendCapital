import Welcomeback from '@/components/Welcomeback';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function page() {
  return (
    <ScrollArea className="h-full">
      <Welcomeback />
    </ScrollArea>
  );
}
