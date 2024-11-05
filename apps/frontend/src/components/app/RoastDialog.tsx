import { Credenza, CredenzaContent, CredenzaHeader, CredenzaTitle, CredenzaBody, CredenzaFooter, CredenzaClose, desktop } from '@/components/ui/credenza';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '../ui/button';
import { useMediaQuery } from '../ui/use-media-query';

export default function RoastDialog(props: Props) {
    const mediaQuery = useMediaQuery(desktop);
    return (
        <Credenza open onOpenChange={() => props.close(true)}>
            <CredenzaContent className="w-screen h-screen scroll-auto">
                <ScrollArea>
                    <CredenzaHeader>
                        <CredenzaTitle>Your roast</CredenzaTitle>
                    </CredenzaHeader>
                    <CredenzaBody>{props.roast}</CredenzaBody>
                    {!mediaQuery && (
                        <CredenzaFooter>
                            <CredenzaClose asChild>
                                <Button variant={'outline'} onClick={() => props.close(true)}>
                                    Close
                                </Button>
                            </CredenzaClose>
                        </CredenzaFooter>
                    )}
                </ScrollArea>
            </CredenzaContent>
        </Credenza>
    );
}

interface Props {
    roast: string;
    close: (value: boolean) => void;
}
