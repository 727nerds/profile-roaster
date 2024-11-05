import { Credenza, CredenzaContent, CredenzaHeader, CredenzaTitle, CredenzaBody, CredenzaTrigger } from '../ui/credenza';

export default function Help() {
  return (
    <Credenza>
      <CredenzaTrigger asChild className='cursor-pointer ml-2'>
          {/* circle-dollar-sign from lucide */}
          <svg className='text-red-600' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
            <path d="M12 18V6" />
          </svg>
      </CredenzaTrigger>
      <CredenzaContent>
          <CredenzaHeader>
            <CredenzaTitle>Help!</CredenzaTitle>
          </CredenzaHeader>
          <CredenzaBody>
            <p>This project has no funds, thus it uses this unstable LLaMA 70b model by Meta that works when it wants.</p>
            <p>After a lot of testing with other models, the best one is Claude 3.5 Sonnet, which mentions a lot of osu! community jokes and the roasts are really harsh in general.</p>
            <p>The API costs a bit, so that's why this LLaMA model was chosen.</p>
            <p>
              If anyone can contact me to donate some money to move to Claude I'm open on Discord: @srizan on the{' '}
              <a href="https://discord.gg/KdGmvyr2yQ" className="text-blue-500">
                BTMC dev server
              </a>
              .
            </p>
          </CredenzaBody>
      </CredenzaContent>
    </Credenza>
  );
}
