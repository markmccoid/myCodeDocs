---
id: git
title: git
sidebar_label: git
---



## Removing files from Git

If you delete a file from your project that is being tracked by git, you can use the `git rm` command OR you can

- Delete the file from you project
- Stage the file in git (git add deletedfilename.txt)
- Commit the change.

Even though it is a deleted file, you need to tell git to remove it from the staging area, which is what git add does.

**Remove Just from git**

What if you started tracking something in git, but didn't want to track it anymore?  Then you can use the `git rm --cached` command.

It will only remove the file from the "Index"

The `-r` is to allow recursive removal.  Need for directories.

```bash
$ git rm --cached -r bin\
```



## Renaming a file

```bash
$ git mv somefile.js renamedsomefile.js
```

This will rename the file and stage it, read for  you to commit.

If you did this manually, you would first have to rename the file and then stage the deletion of the old file (even though it was rename, we are deleting it from the staging area).  Then stage and commit the new file.

## Skip the Staging Area

This will skip staging area, but **only** for files that are already being tracked.

```bash
git commit -am "commit message"
```

