
**How to install**

-  1. install `npm install`

-  2. run local `npm run start`

-  3. deploy `npm run deploy`

**How to deploy to github pages**

1. push every code to latest code.
   
2. `npm run build`

3. `npm run deploy`

**this code for my portfolio only**

**Special thank**
this code is clone from 
`https://github.com/Dorota1997/react-frontend-dev-portfolio?tab=readme-ov-file`

**How to run Docker**
1. docker build -t my-portfolio .

**make it to gcp storage host**
1. build app
npm run build

****https://www.youtube.com/watch?v=8Te487oYUeo****

2. create bucket on gcp
gsutil mb -p [PROJECT_ID] -l asia-southeast1 -b on gs://[YOUR_BUCKET_NAME]
gsutil mb -p scenic-style-456211-p5 -l asia-southeast1 -b on gs://therutss-portfolio

**create acl to bucket**
gsutil uniformbucketlevelaccess get gs://therutss-portfolio
gsutil uniformbucketlevelaccess set on gs://therutss-portfolio
gsutil iam ch allUsers:objectViewer gs://therutss-portfolio

3. create bucket to web host
gsutil web set -m index.html -e 404.html gs://[YOUR_BUCKET_NAME]
gsutil web set -m index.html -e 404.html gs://therutss-portfolio

4. push build local to gcp storage
gsutil -m cp -r build/* gs://[YOUR_BUCKET_NAME]
gsutil -m rsync -d -r build/ gs://therutss-portfolio

6. set cores to bucket
gsutil cors set public/cors.json gs://therutss-portfolio