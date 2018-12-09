import PropTypes from 'prop-types';
import swal from 'sweetalert2';

const MyPromptAlert = (props) => {
  const confirmAlert = (confirmFunction) => swal({
    title: props.title ? props.title : 'Are you sure?',
    text: props.text ? props.text : null,
    type: props.type ? props.type : null,
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    confirmButtonText: props.confirmButtonText,
    cancelButtonColor: '#d33',
    cancelButtonText: props.cancelButtonText
  }).then((result) => {
    if (result.value) {
      confirmFunction()
    } else {
      props.onCancel()
    }
  })

  const onConfirm = () => confirmAlert(props.onConfirm)
  return (
    props.children(onConfirm)
  );
};

MyPromptAlert.propTypes = {
  /* title of the prompt */
  title: PropTypes.string,
  /* text under the title of the prompt */
  text: PropTypes.string,
  /* Sweetalert2 type icon. 5 options - success, error, warning, info, question https://sweetalert2.github.io/#popup-types */
  type: PropTypes.string,
  /* confirm button */
  confirmButtonText: PropTypes.string,
  /* cancel button */
  cancelButtonText: PropTypes.string,
  /* confirm function to run if confirm button pressed */
  onConfirm: PropTypes.func,
  /* cancel function to run if cancel button pressed */
  onCancel: PropTypes.func,
}

MyPromptAlert.defaultProps = {
  title: 'Are you sure?',
  text: null,
  type: null,
  confirmButtonText: 'Ok',
  cancelButtonText: 'Cancel',
  onCancel: () => null,
}

export default MyPromptAlert;