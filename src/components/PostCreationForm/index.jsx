import React, { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { updatePost, createPost } from 'components/Api';
import ImageUpload from 'components/ImageUpload';
import Checkbox from 'UI/Checkbox';
import Button from 'UI/Button';
import s from '.././ImageUpload/post.module.css'; 
import { useBlogContext } from 'BlogContext';
import moment from 'moment'; 

export default function PostCreationForm() {
  const { setShowPostForm, showPostForm, onUpdatePosts, editPostData, handleSave, handleCloseModal } = useBlogContext();
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
  const [isDraft, setIsDraft] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);

  const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm({
    criteriaMode: 'all',
  });

  const handleImageUpload = useCallback((url) => {
    setImageUrl(url);
  }, []);

  useEffect(() => {
    if (editPostData) {
      setValue('title', editPostData.title || '', { shouldValidate: true });
      setValue('description', editPostData.description || '', { shouldValidate: true });
      setValue('content', editPostData.body || '', { shouldValidate: true });
      setSelectedDate(editPostData.publishDate ? moment(editPostData.publishDate).format('YYYY-MM-DD') : moment().format('YYYY-MM-DD'));
      if (editPostData.currentImage) {
        setImageUrl(editPostData.currentImage);
      }
      setIsDraft(editPostData.draft || false);
    }
  }, [editPostData, setValue, setImageUrl, setIsDraft]);

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const onSubmit = async (data) => {
    let formattedDate = selectedDate ? moment(selectedDate).format('YYYY-MM-DDT00:00:00') : '';

    const postData = {
      title: data.title,
      description: data.description,
      body: data.content,
      imageUrl,
      publishDate: formattedDate,
      draft: isDraft,
    };

    try {
      const method = editPostData ? () => updatePost(postData, editPostData.id) : createPost;
      const postResponse = await method(postData);
      console.log('Post response:', postResponse);

      if (editPostData) {
        await handleSave(postData, editPostData.id);
        onUpdatePosts();
      } else {
        onUpdatePosts();
        setShowPostForm(false);
      }
      reset();
      handleCloseModal();
      onUpdatePosts();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };


  return (
    <div className={`post-form__section ${showPostForm ? "active" : ""}`}>
      <div className='container'>
        <form
          className='post-form'
          onSubmit={handleSubmit(onSubmit)}
          data-test='post-creation-form'
        >
          <div className='form-group'>
            <input
              type='text'
              className={`form-control ${errors.title ? 'error-border' : ''}`}
              {...register('title', {
                required: 'Title is required',
                maxLength: 40,
              })}
              placeholder='Title'
              data-test='title-input'
            />
            {errors.title && <p className='error'>Please fill the field</p>}
          </div>
          <div className='form-group'>
            <input
              type='text'
              className={`form-control ${errors.description ? 'error-border' : ''}`}
              {...register('description', {
                required: 'Description is required',
                maxLength: 100,
              })}
              placeholder='Description'
              data-test='description-input'
            />
            {errors.title && <p className='error'>Please fill the field</p>}
          </div>
          <div className='form-group'>
            <textarea
              className={`form-control ${errors.content ? 'error-border' : ''}`}
              {...register('content', {required: 'Content is required'})}
              rows='3'
              placeholder='My thoughts. No more than 1000 characters'
              data-test='textarea'
            ></textarea>
            {errors.title && <p className='error'>Please fill the field</p>}
          </div>
          <ImageUpload
            handleImageUpload={handleImageUpload}
            defaultPhoto={imageUrl}
            className={s.dropzone} 
            isUserForm={false}
          />
          <div className='form__checkbox'>
          <div className='form-group'>
          <input
              type="date"
              id="publishDate"
              name="publishDate"
              value={selectedDate}
              onChange={handleDateChange}
              className={`form-control ${errors.publishDate ? 'error-border' : ''}`}
            />
          </div>
            <Checkbox
              id={'draftCheckbox'}
              isTrue={isDraft}
              setIsTrue={setIsDraft}
              text={'Save as a draft'}
            />
          </div>

          {Object.keys(errors).length > 0 && (
            <p className='error'>Please fill all fields</p>
          )}

          <div className='btn__sbmt'>
            <Button text='Submit Post' />
          </div>
        </form>
      </div>
    </div>
  );
}
