import { ProductImage } from '@/types';
import { InboxOutlined, UploadOutlined } from '@ant-design/icons';
import { Button, Card, Form, Image, Upload } from 'antd';
import type { FormInstance, GetProp, UploadFile, UploadProps } from 'antd';
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

const { Dragger } = Upload;

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export const ProductImages = memo(
  ({
    form,
    images,
    action,
  }: {
    form?: FormInstance;
    images?: ProductImage[];
    action: 'create' | 'show' | 'edit';
  }) => {
    const initialImgsRef = useRef<UploadFile[]>([]);
    const [thumbnail, setThumbnail] = useState<UploadFile>();
    const [imgs, setImgs] = useState<UploadFile[]>();
    const [previewImage, setPreviewImage] = useState('');
    const [previewOpen, setPreviewOpen] = useState(false);

    const thumbnailImg = useMemo(
      () => images?.filter((img) => img.isThumbnail == true)[0],
      [],
    );

    useEffect(() => {
      if (images && thumbnailImg) {
        setThumbnail({
          uid: thumbnailImg.id,
          url: thumbnailImg.url,
          name: 'Thumbnail',
          status: 'done',
        });

        setImgs(
          images
            .filter((img) => img.isThumbnail == false)
            .map((img) => ({
              uid: img.id,
              url: img.url,
              name: 'Image',
              status: 'done',
            })),
        );
      }
    }, []);

    useEffect(() => {
      if (images) {
        initialImgsRef.current = images
          .filter((img) => !img.isThumbnail)
          .map((img) => ({
            uid: img.id,
            url: img.url,
            name: 'Image',
            status: 'done',
          }));
      }
    }, [images]);

    const updateFormValues = useCallback(() => {
      if (!form) return;

      const formImages: any[] = [];

      if (thumbnail) {
        formImages.push({
          isThumbnail: true,
          file: thumbnail.originFileObj || null,
        });
      }

      imgs?.forEach((file) => {
        formImages.push({
          isThumbnail: false,
          file: file.originFileObj || null,
        });
      });

      form.setFieldsValue({
        images: formImages,
      });
    }, [form, thumbnail, imgs]);

    useEffect(() => {
      updateFormValues();
    }, [updateFormValues]);

    const handlePreview = async (file: UploadFile) => {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj as FileType);
      }

      setPreviewImage(file.url || (file.preview as string));
      setPreviewOpen(true);
    };

    const handleChangeThumbnail: UploadProps['onChange'] = ({ file }) => {
      form?.setFieldsValue({ changeThumbnail: true });

      setThumbnail({
        uid: file.uid,
        url: URL.createObjectURL(file as any),
        originFileObj: file as FileType,
        name: 'Thumbnail',
      });
    };

    const handleChangeImgs: UploadProps['onChange'] = ({ fileList }) => {
      const prev = initialImgsRef.current;

      const removed = prev
        .filter((oldFile) => !fileList.some((f) => f.uid === oldFile.uid))
        .map((f) => f.uid);

      if (removed.length > 0) form?.setFieldsValue({ deleteImages: removed });

      setImgs(fileList);
    };

    return (
      <Card>
        <Form.Item hidden name='deleteImages' />
        <Form.Item hidden name='changeThumbnail' />
        <Form.Item
          name='images'
          rules={[{ required: true, message: 'Thumbnail is require' }]}
        >
          <div className='flex flex-col gap-3'>
            <div className='flex-1 gallery-main'>
              {action == 'create' && !thumbnail && (
                <Dragger disabled>
                  <p style={{ fontSize: 52, marginBottom: 8 }}>
                    <InboxOutlined style={{ color: '#ccc' }} />
                  </p>
                  <p style={{ fontSize: 14, color: '#555', marginBottom: 4 }}>
                    Click button Upload below to upload thumbnail
                  </p>
                  <p style={{ fontSize: 12, color: '#aaa' }}>
                    PNG, JPG, WEBP — max 5 MB each
                  </p>
                </Dragger>
              )}
              <Image src={thumbnail?.url || thumbnail?.preview} />
              {action !== 'show' && (
                <Upload
                  className='!w-full'
                  onChange={handleChangeThumbnail}
                  beforeUpload={() => false}
                  showUploadList={false}
                >
                  <Button icon={<UploadOutlined />} className='!w-full'>
                    Upload Thumbnail
                  </Button>
                </Upload>
              )}
            </div>
            <div className='flex gap-2 justify-between flex-wrap" shrink-0'>
              {action == 'show' ? (
                imgs?.map((img) => (
                  <div key={img.uid}>
                    <Image
                      key={img.uid}
                      src={img.url}
                      width={68}
                      height={68}
                    />
                  </div>
                ))
              ) : (
                <>
                  <Upload
                    listType='picture-card'
                    fileList={imgs}
                    onPreview={handlePreview}
                    onChange={handleChangeImgs}
                    beforeUpload={() => false}
                    maxCount={10}
                  >
                    <Button
                      icon={<UploadOutlined />}
                      type='link'
                      className='!w-fit'
                    />
                  </Upload>
                  {previewImage && (
                    <Image
                      wrapperStyle={{ display: 'none' }}
                      preview={{
                        visible: previewOpen,
                        onVisibleChange: (visible) => setPreviewOpen(visible),
                        afterOpenChange: (visible) =>
                          !visible && setPreviewImage(''),
                      }}
                      src={previewImage}
                    />
                  )}
                </>
              )}
            </div>
          </div>
        </Form.Item>
      </Card>
    );
  },
);
