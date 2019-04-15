<template>
  <v-layout>
    <v-flex xs12 sm6 offset-sm3>
      <v-card>
        <v-card-text>
          <div id="firebaseui-auth-container"></div>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
/* global firebase firebaseui */
export default {
  mounted() {
    this.unsubscribe = firebase.auth().onAuthStateChanged(() => this.init());
  },
  destroyed() {
    this.unsubscribe();
  },
  methods: {
    async init() {
      const auth = firebase.auth();
      if (auth.currentUser) {
        this.$router.replace('/home');
      } else {
        const ui = firebaseui.auth.AuthUI.getInstance() || new firebaseui.auth.AuthUI(auth);
        ui.start('#firebaseui-auth-container', {
          signInOptions: [
            firebase.auth.EmailAuthProvider.PROVIDER_ID,
          ],
          signInSuccessUrl: '#/home',
          credentialHelper: firebaseui.auth.CredentialHelper.NONE,
        });
      }
      // user.updateProfile({ displayName: 'Hentaro' });
    },
  },
};
</script>
