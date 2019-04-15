<template>
  <v-app dark>
    <v-toolbar app>
      <v-toolbar-title class="headline text-uppercase">
        <span>Shall We Talk</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn
        flat
        v-if="currentUser"
        @click="logout"
      >
        <span class="mr-2">logout</span>
      </v-btn>
    </v-toolbar>

    <v-content>
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
/* global firebase */
export default {
  name: 'App',
  components: {
  },
  beforeCreate() {
    this.$router.afterEach(() => {
      if (!firebase.auth().currentUser) {
        this.$router.replace('/');
      }
    });
    firebase.auth().onAuthStateChanged((user) => {
      this.currentUser = user;
      if (user) {
        // do nothing.
      } else {
        this.$router.replace('/');
      }
    });
  },
  data() {
    return {
      currentUser: null,
    };
  },
  methods: {
    async logout() {
      await firebase.auth().signOut().catch(error => console.log(error));
    },
  },
};
</script>
