import React, {Component} from "react";
import {
  Icon,
  message,
  Popconfirm
} from "antd";
import {rootUrl, thumbnailPath} from "../../../utils/constant";
import styles from '../Course.less';


export default class CourseImageUpload extends Component {
  constructor(props) {
    super(props);
    this.srcArr = [];
    this.postGallery = [];
    this.state = {
      gallery: [],
      per: 0
    }
  }

  // 上传封面图片
  uploadCover(e) {
    // const _token = "Bearer "+localStorage.getItem('jwt');
    const img = document.getElementById("upload-img").files[0];
    let formData = new FormData();
    formData.append("file", img);
    console.log('formData ', formData, img);
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "https://api.yichui.net/api/young/post/upload/image");
    xhr.send(formData);

    const hide = message.loading('正在上传图片......', 0);

    xhr.addEventListener("load", () => {
      let _src = JSON.parse(xhr.responseText).filename;
      console.log("上传成功： ", _src);
      this.srcArr.push(_src);
      this.postGallery = this.srcArr;
      console.log("图片数组: ", this.srcArr);
      this.setState({ gallery: this.srcArr }, () => {
        setTimeout(hide, 1000);
      });
      this.props.form.setFieldsValue({
        gallery: this.postGallery
      });
    });

    xhr.addEventListener("error", () => {
      notification['error']({
        message: '错误警告',
        description: "图片上传失败",
        duration: 2
      });
      console.error("上传失败：", JSON.parse(xhr.responseText));
    });

    xhr.addEventListener("progress", (evt) => {
      console.log(evt)
      var loaded = evt.loaded;//已经上传大小情况
      var tot = evt.total;  //附件总大小
      var per = Math.floor(100*loaded/tot);  //已经上传的百分比
      console.log("已经上传的百分比: ", per);
      this.setState({per: per});
    });

  }


  /**
   * 删除上传的图片
   * @returns {*}
   */
  deleteUpload = item => {
    // console.log("this.postGallery==>", this.postGallery);
    // console.log("删除上传的图片: ", item);
    Array.prototype.indexOf = function(val) {
      for (let i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
      }
      return -1;
    };
    Array.prototype.remove = function(val) {
      let index = this.indexOf(val);
      if (index > -1) {
        this.splice(index, 1);
      }
    };
    this.postGallery.remove(item);
    // console.log("删除后: ", this.postGallery);
    this.setState({ gallery: this.postGallery });
    this.props.form.setFieldsValue({
      gallery: this.postGallery
    });
  };

  render() {
    return(
      <div>
        {/*<div className={styles.upload_preview}>*/}
          {/*<div className={styles.upload_progress}>*/}
            {/*<Progress type="circle" percent={this.state.per} width={80}/>*/}
          {/*</div>*/}
        {/*</div>*/}
        <label className={styles.upload_img_label} htmlFor="upload-img">
          <Icon type="plus" className={styles.upload_icon} />
        </label>
        {this.state.gallery.length > 0 &&
          this.state.gallery.map(item => {
            return (
              <div key={item} className={styles.upload_list_item}>
                <img
                  className={styles.upload_list_img}
                  src={rootUrl + thumbnailPath + item}
                />
                <div className={styles.delete_upload_mask}>
                  <Popconfirm
                    placement="top"
                    title={"你确定删除该图片?"}
                    onConfirm={() => this.deleteUpload(item)}
                    okText="确定"
                    cancelText="取消"
                  >
                    <Icon type="delete" className={styles.delete_upload} />
                  </Popconfirm>
                </div>
              </div>
            );
          })}
        <input
          className={styles.upload_img}
          id="upload-img"
          type="file"
          name="img"
          // disabled={this.state.postGallery.length > 10 ? "disabled" : ""}
          onChange={file => this.uploadCover(file)}
        />
      </div>
    )
  }
}
