# Project Setup

## From Terminal

```Shell
git clone <project-repo-url>
```

```Shell
cd <project-directory>/ansible
```

```Shell
ansible-playbook setup.yml -i ./hosts --private-key ~/.ssh/<your_ssh_key> --ask-become-pass
```
> Note: Change out `<your_ssh_key>` with the name of your ssh_key

> Note: When prompted for SUDO password, enter the <non_root_ssh_pass>