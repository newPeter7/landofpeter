<template>
  <div>
    <div id="editor"></div>
    <input id="uploadImg" type="file" style="display:none" accept="image/png, image/jpeg, image/gif" @change="uploadImage">
  </div>
</template>

<script>
  import Quill from 'quill'
  import api from '../api/interface'

  export default {
    name: "QuillEditor",
    data () {
      return {
        msg: 'Welcome to Your Vue.js App',
        toolbarOptions: [
          ['bold', 'underline', 'strike','image'],        // toggled buttons
          ['blockquote', 'code-block'],

          [{ 'header': 1 }, { 'header': 2 }],               // custom button values
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
          [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
          [{ 'direction': 'rtl' }],                         // text direction

          [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
          [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

          [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
          [{ 'font': [] }],
          [{ 'align': [] }],

          ['clean']                                         // remove formatting button
        ],
      }
    },
    beforeDestroy () {
      this.quill = null
      delete this.quill
    },
    methods:{
      initQuill () {
        const quill = new Quill('#editor', {
          theme: 'snow',
          modules: {
            toolbar: this.toolbarOptions
          }
        })
        this.quill = quill
        this.quill.getModule("toolbar").addHandler("image", this.uploadImageHandler)
      },
      uploadImageHandler () {
        const input = document.querySelector('#uploadImg')
        input.value = ''
        input.click()
      },
      async uploadImage (event) {
        const form = new FormData()
        form.append('file', event.target.files[0])
        this.$Utils
          .commonAjax({
            url: api.interfaceConfig.upload,
            type: 'POST',
            data: form,
            flag: true
          }).then(res => {
            if (res.success) {
              let url = res.result ? res.result[0].imageUrl : '';
              const addImageRange = this.quill.getSelection()
              const newRange = 0 + (addImageRange !== null ? addImageRange.index : 0)
              this.quill.insertEmbed(newRange, 'image', url)
              this.quill.setSelection(1 + newRange)

            } else {
              this.$message.warning('上传失败')
            }
          })
          .catch(err => {

          })

      },
      getContents () {
        return this.quill.getContents()
      },
      setContents (data) {
        return this.quill.setContents(data)
      },
      getLength () {
        return this.quill.getLength()
      },
      getHtml () {
        return this.quill.container.firstChild.innerHTML
      }
    },
    mounted () {
      this.initQuill();
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
