# dev mode and production mode scripts

## rename 3 files:
1. server/client/src/env-{d|p}
2. server/env.js
3. server/index.js

I only want to rename one or two files...

Will have to change client env because create-react-app won't let you import a file in a parent directory
X 0. Switch to dev mode and confirm working
1. Make client env the only env file
2. Move necessary changes in server/index.js to client env file

DEV -> PRODUCTION:
  A. client env
    mv server/client/src/client-env.js server/client/src/client-env-d.js; mv server/client/src/client-env-p.js server/client/src/client-env.js

  B. server env
    mv server/server-env.js server/server-env-d.js; mv server/server-env-p.js server/server-env.js

  C. index.js
    mv server/index.js server/index-d.js; mv server/index-p.js server/index.js
```
mv server/client/src/client-env.js server/client/src/client-env-d.js; mv server/client/src/client-env-p.js server/client/src/client-env.js;
mv server/server-env.js server/server-env-d.js; mv server/server-env-p.js server/server-env.js;
mv server/index.js server/index-d.js; mv server/index-p.js server/index.js
```

PRODUCTION -> DEV:
  A. client env
    mv server/client/src/client-env.js server/client/src/client-env-p.js; mv server/client/src/client-env-d.js server/client/src/client-env.js

  B. server env
    mv server/server-env.js server/server-env-p.js; mv server/server-env-d.js server/server-env.js

  C. index.js
    mv server/index.js server/index-p.js; mv server/index-d.js server/index.js

```
mv server/client/src/client-env.js server/client/src/client-env-p.js; mv server/client/src/client-env-d.js server/client/src/client-env.js;
mv server/server-env.js server/server-env-p.js; mv server/server-env-d.js server/server-env.js;
mv server/index.js server/index-p.js; mv server/index-d.js server/index.js
```