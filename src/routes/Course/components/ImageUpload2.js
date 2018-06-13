import React, { Component } from "react";
import { Icon, message, Popconfirm } from "antd";
import { rootUrl, thumbnailPath } from "../../../utils/constant";
import styles from "../../../components/ImageUpload/ImageUpload.less";

export default class ImageUpload extends Component {
  constructor(props) {
    super(props);
    this.postGallery = [];
    this.state = {
      gallery: [],
      per: 0
    };
  }

  // 上传封面图片
  handleUpload(e) {
    const { uploadPath, uploadRef } = this.props;
    // const _token = "Bearer "+localStorage.getItem('jwt');
    const img = document.getElementById(uploadRef).files[0];
    let formData = new FormData();
    formData.append("file", img);
    const xhr = new XMLHttpRequest();
    xhr.open("POST", uploadPath);
    xhr.send(formData);

    const hide = message.loading("正在上传图片......", 0);

    xhr.addEventListener("load", () => {
      const filename = JSON.parse(xhr.responseText).filename;
      // console.log("上传成功： ", filename);
      if (this.props.onUpload) {
        this.props.onUpload(filename);
      }
      if (this.props.mode && this.props.mode === "multiple") {
        // console.log("可以上传多张图片");
        this.postGallery.push(filename);
        this.setState({ gallery: [...this.postGallery] });
      } else {
        // console.log("最多1张图片");
        this.postGallery = [];
        this.postGallery.push(filename);
        this.setState({ gallery: [...this.postGallery] });
      }
      setTimeout(hide, 1000);
    });

    xhr.addEventListener("error", () => {
      notification["error"]({
        message: "错误警告",
        description: "图片上传失败",
        duration: 2
      });
      console.error("上传失败：", JSON.parse(xhr.responseText));
    });

    xhr.addEventListener("progress", evt => {
      console.log(evt);
      const loaded = evt.loaded; //已经上传大小情况
      const tot = evt.total; //附件总大小
      const per = Math.floor(100 * loaded / tot); //已经上传的百分比
      console.log("已经上传的百分比: ", per);
      this.setState({ per: per });
    });
  }

  /**
   * 删除上传的图片
   * @returns {*}
   */
  deleteUpload = item => {
    Array.prototype.indexOf = function(val) {
      for (let i = 0; i < this.length; i++) {
        if (this[i] === val) return i;
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
    this.props.ondelete(item);
    this.setState({ gallery: [...this.postGallery] });
  };

  componentDidMount() {
    const { defaultImages } = this.props;
    this.setState({gallery: defaultImages})
  }

  render() {
    const { uploadRef, uploadNum } = this.props;
    const { gallery } = this.state;
    return (
      <div>
        {gallery.map((item, i) => (
          <div key={i} className={styles.upload_list_item}>
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
        ))}
        <label
          style={gallery.length >= uploadNum ? { borderColor: "#efefef" } : {}}
          className={styles.upload_img_label}
          htmlFor={uploadRef}
        >
          <Icon
            type="plus"
            className={
              gallery.length < uploadNum
                ? styles.upload_icon
                : [styles.upload_icon, styles.disable_upload]
            }
          />
        </label>
        <input
          className={styles.upload_img}
          id={uploadRef}
          type="file"
          name="img"
          disabled={gallery.length >= uploadNum ? "disabled" : ""}
          onChange={file => this.handleUpload(file)}
        />
      </div>
    );
  }
}
