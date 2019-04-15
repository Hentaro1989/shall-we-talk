<template>
  <div style="padding: 10px;" :class="{ mine: isMine, other: !isMine}">
    <div class="chat-bubble">{{text}}</div>
    <div>{{datetime}}</div>
  </div>
</template>

<script>
export default {
  props: {
    isMine: Boolean,
    text: String,
    datetime: String,
    userId: String,
  },
};
</script>

<style scoped>
.chat-bubble {
  max-width: 80%;
  white-space: pre-line;
  word-wrap: break-word;
  display: inline-block;
  text-align: left;
  padding: 10px 20px;
  color: white;
  border: 1px black solid;
  border-radius: 20px;
  background-color: gray;
}

.mine {
  text-align: right;
}

.other {
  text-align: left;
}
</style>
