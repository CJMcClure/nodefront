### [Server Setup](./setup.md)

# Deploying with our pipeline

## Terminal

Open a new terminal, on your machine and navigate to your project directory:

```Shell
cd /Path/to/your/project
```
Our deployment pipeline leverages **Feature Branch Workflow**, so before we begin developing our changes, we need to be on a unique git branch, which we can get to with the following command: 

```Shell
git checkout -b <branch-name>
```
> Note: The `-b` option creates the `<branch-name>` if it doesn't already exist 

**Now, make the necessary changes to your project in your favorite text editor**

> Note: Once you've saved your changes, pick back up here and complete the following steps. 

```Shell
git add <altered-files>
```
```Shell
git commit -m "<message-about-changes>"
```
```Shell
git push origin <feature-branch>
```

## Github

Navigate to your projects repository on Github

We need to create several pull requests to get our feature from it's feature branch to the production server.

* `base: development` to `compare: feature`
* `base: prerelease` to `compare: development`
* `base: master` to `compare: prerelease`

For each of the three above requests, follow these steps:

1. Click the `Pull Requests` tab in the top menu bar

2. Click the green `New pull request` button

3. Set the `base` branch

4. Set the `compare` branch 

5. Click the green `Create pull request` button

6. Add a description of your feature

7. Click the next green `Create pull request` button
> Note: if both branches are able to be merged, you'll have the option to complete the final step

8. Click the `Merge Pull Request` button

9. Click the `Confirm Merge` button 