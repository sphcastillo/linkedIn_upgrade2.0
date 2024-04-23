import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "./ui/badge"


function Post() {
  return (
    <div className="bg-white rounded-md border">
        <div className='p-4 flex space-x-2'>
            <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
        </div>

        <div className="flex justify-between flex-1">
            <div>
            <p className="font-semibold">

                <Badge className="ml-2" variant="secondary">
                  Author
                </Badge>
            
            </p>

            <p className="text-xs text-gray-400">
                @shadcn
            </p>
            </div>
        </div>
    </div>
  )
}

export default Post