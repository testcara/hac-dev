# GIT HELP

## to keep sync with the original repo

```bash
export HTTP_PROXY=http://squid.corp.redhat.com:3128
export HTTPS_PROXY=http://squid.corp.redhat.com:3128
git fetch --verbose upstream 
git merge upstream/main
git push
git checkout -b git_help
touch GIT_README.md
```
