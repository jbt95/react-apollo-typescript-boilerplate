import { useRouter } from "next/router";

export default function(context: any, target: string) {
  const router = useRouter();
  if (context.res) {
    context.res.writeHead(303, { Location: target });
    context.res.end();
  } else {
    router.replace(target);
  }
}
