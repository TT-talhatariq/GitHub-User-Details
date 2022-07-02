//https://api.github.com/users/USERNAME/repos
const APIURL = 'https://api.github.com/users/'

const form = document.getElementById('form')
const userName = document.getElementById('search')
const container = document.querySelector('.card')

const getUserDetails = async function (userName) {
  //Fetching Profile Data
  const response = await fetch(APIURL + userName)
  //If Profile not Exists
  if (!response.ok) {
    throw new Error('UserName not Found')
  }

  const ProfileData = await response.json()

  //Fetching Repos Data
  const repos = await fetch(APIURL + userName + '/repos')
  let Repos = await repos.json()

  if (Repos.length > 5) Repos = Repos.slice(0, 5)

  const repoList = Repos.map((repo) => {
    return repo.name
  })

  //Returing Data
  const requiredData = {
    name: ProfileData.name,
    bio: ProfileData.bio,
    noofRepos: ProfileData.public_repos,
    image: ProfileData.avatar_url,
    followers: ProfileData.followers,
    followings: ProfileData.following,
    repos: repoList,
  }
  return requiredData
}

form.addEventListener('submit', async (e) => {
  if (container.classList.contains('hidden'))
    container.classList.remove('hidden')

  e.preventDefault()

  const userUrl = APIURL + userName
  let markup = ''

  try {
    const userData = await getUserDetails(userName.value)

    markup = `
    <div class="image">
    <img src="${userData.image}" alt="" />
    </div>
    <div class="user-info">
    <h2 class="user-name">${userData.name ? userData.name : 'No Name'}</h2>
    <p class="bio">
    ${userData.bio ? userData.bio : 'No Bio'}
    </p>
    <ul>
        <li>${userData.followers} <strong>Followers</strong></li>
        <li>${userData.followings} <strong>Following</strong></li>
        ${
          userData.noofRepos
            ? `<li>
              ${userData.noofRepos} <strong>Repos</strong>
            </li>`
            : ''
        }
    </ul>
    <div class="repos">
        ${userData.repos
          .map((repo) => `<a href="" class="repo">${repo}</a>`)
          .join('')}
    </div>
    </div>
  `
  } catch (err) {
    markup = `
        <div><h3>User Name not Found</h3></div>
    `
  }
  container.innerHTML = ''
  container.insertAdjacentHTML('beforeend', markup)
})

const getStats = () => {}
getUserDetails()
