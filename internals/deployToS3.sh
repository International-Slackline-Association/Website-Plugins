# Enable printing executed commands
set x
trap "exit" INT


# Get AWS PROFILE, S3 Bucket and CloudFront Id from environment variables or write it down statically
aws_profile=$AWS_PROFILE
s3_bucket=$S3_BUCKET_NAME

echo Profile: $aws_profile
echo S3_Bucket: $s3_bucket

if [ -z "$aws_profile" ]; then
  echo AWS_PROFILE not found
  exit
fi
if [ -z "$s3_bucket" ]; then
  echo S3_BUCKET not found
  exit
fi

red=`tput setaf 1`
green=`tput setaf 2`
reset=`tput sgr0`

#set env variable for aws cli
export AWS_PROFILE=$aws_profile

if [ ! -d "build" ]; then
    echo "${red}Build folder not found${reset}"
    exit 0;
fi

echo "${green}Synching Build Folder: $s3_bucket...${reset}"
aws s3 sync build/ s3://$s3_bucket --delete --cache-control max-age=31536000,public

echo "${green}Adjusting cache...${reset}"
aws s3 cp s3://$s3_bucket/index.html s3://$s3_bucket/index.html --metadata-directive REPLACE --cache-control max-age=0,no-cache,no-store,must-revalidate --content-type text/html --acl public-read
