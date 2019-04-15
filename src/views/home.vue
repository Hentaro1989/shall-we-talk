<template>
  <v-list two-line>
    <template v-for="(item, index) in items">
      <v-list-tile
        :key="index"
        avatar
        @click="$router.push({ name: 'chat', params: { roomId: item.roomId }})"
      >
        <v-list-tile-avatar>
          <img :src="item.avatar">
        </v-list-tile-avatar>
        <v-list-tile-content>
          <v-list-tile-title v-html="item.userNames"></v-list-tile-title>
          <v-list-tile-sub-title v-html="item.text"></v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>
    </template>
  </v-list>
</template>

<script>
/* global firebase */
export default {
  components: {
  },
  mounted() {
    this.unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        firebase.firestore().collection('users').doc(user.uid).set({
          id: user.uid,
          name: user.displayName,
        });
        this.fetchRooms();
      }
    });
  },
  destroyed() {
    this.unsubscribe();
  },
  data() {
    return {
      sampleText: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
      items: [],
    };
  },
  methods: {
    async fetchRooms() {
      const firestore = firebase.firestore();
      const auth = firebase.auth();
      const roomCollection = await firestore.collection('rooms').where('userIds', 'array-contains', auth.currentUser.uid).get();
      const roomIds = [];
      roomCollection.forEach(room => roomIds.push(room.id));
      const users = await this.fetchUsers();
      for (let i = 0; i < roomIds.length; i++) {
        const room = firestore.collection('rooms').doc(roomIds[i]);
        const roomDetail = await room.get();
        const userNames = roomDetail.data().userIds
          .map(userId => users.filter(user => user.id === userId).map(user => user.name)[0] || userId);
        const msgCollection = await room.collection('messages').orderBy('timestamp', 'desc').get();
        const msg = msgCollection.docs[0]
          ? msgCollection.docs[0].data()
          : {};
        this.items.push({ ...msg, roomId: roomIds[i], userNames });
      }
    },
    async fetchUsers() {
      const usersCollection = await firebase.firestore().collection('users').get();
      const users = [];
      usersCollection.forEach(user => users.push(user.data()));
      return users;
    },
  },
};
</script>
