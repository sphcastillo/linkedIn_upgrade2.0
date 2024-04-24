/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'links.papareact.com',
            },
            {
                protocol: 'https',
                hostname: 'image.clerk.com',
            },
            // need to change this later
            {
                protocol: 'https',
                hostname: 'linkedinclone.blob.core.windows.net',
            }
        ]
    }
};

export default nextConfig;
