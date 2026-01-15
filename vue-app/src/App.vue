<script setup>

import {RouterLink, RouterView, useRouter} from 'vue-router'


const router=useRouter()


function handleLogout(){
  router.push('/')
}
</script>

<template>
  <header>
    <img alt="Library logo" class="logo" src="@/assets/Library Logo.png" width="125" height="125" />

    <div class = "wrapper">
      <nav>
      <RouterLink to="/books">Books</RouterLink>

      </nav>
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
<style scoped>
header {
  line-height: 1.5;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 2rem;
  border-bottom: 1px solid var(--color-border);
  background-color: var(--color-background);
}

.logo {
  height: 50px;
  width: 50px;
}

.wrapper {
  flex: 1;
  display: flex;
  justify-content: flex-end;
}

nav {
  display: flex;
  gap: 2rem;
  font-size: 1rem;
  align-items: center;
}

</style>
