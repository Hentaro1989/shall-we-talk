<template>
  <div style="height: 100%; position: relative;">
    <v-list style="height: 100%; padding-bottom: 70px;">
      <template v-for="item in items">
        <chat-bubble
          :key=item.id
          :isMine=item.isMine
          :text=item.text
          :datetime=item.datetime
          :userId=item.userId
        ></chat-bubble>
      </template>
    </v-list>
    <div style="position: fixed; bottom: 0; width: 100%">
      <v-textarea
        v-model=text
        rows="1"
        auto-grow
        background-color="black"
      ></v-textarea>
      <v-btn
        fab
        fixed
        right
        bottom
        @click=send()
      >
        <v-icon>send</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script>
/* global firebase */
import ChatBubble from '../components/chatBubble.vue';

export default {
  mounted() {
    this.unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.fetchChat();
      }
    });
  },
  destroyed() {
    this.unsubscribe();
  },
  data() {
    return {
      items: [],
      text: '',
    };
  },
  components: {
    ChatBubble,
  },
  methods: {
    async fetchChat() {
      const firestore = firebase.firestore();
      const auth = firebase.auth();
      await firestore
        .collection('rooms').doc(this.$route.params.roomId)
        .collection('messages')
        .orderBy('timestamp', 'asc')
        .onSnapshot((docs) => {
          const items = [];
          docs.forEach(doc => items.push({ ...doc.data(), id: doc.id }));
          items.forEach((item) => {
            const date = item.timestamp.toDate();
            item.datetime = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
          });
          this.items = Array.isArray(items)
            ? items.map(log => ({ ...log, isMine: log.userId === auth.currentUser.uid }))
            : [];
        });
    },
    send() {
      if (!this.text) {
        return;
      }
      const firestore = firebase.firestore();
      const auth = firebase.auth();
      firestore
        .collection('rooms').doc(this.$route.params.roomId)
        .collection('messages').add({
          text: this.text,
          timestamp: new Date(),
          userId: auth.currentUser.uid,
        });
      this.text = null;
    },
  },
};
</script>
