import { currentUser } from "@clerk/nextjs/server";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";


async function UserInformation() {
    const user = await currentUser();

    const firstName = user?.firstName;
    const lastName = user?.lastName;
    const imageUrl = user?.imageUrl;
    return (
        <div  className="flex flex-col  justify-center  items-center bg-white mr-6 ">
            <Avatar>
                <AvatarImage src={user?.imageUrl || 'https://github.com/shadcn.png'} />
                <AvatarFallback>
                    {user?.firstName?.charAt(0)} 
                    {user?.lastName?.charAt(0)}
                </AvatarFallback>
            </Avatar>

            {/* <SignedOut>
                <div className=""></div>
            </SignedOut> */}

        </div>
    )
}

export default UserInformation