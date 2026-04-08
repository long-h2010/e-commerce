import { ProductImage } from '@/types';
import { UploadOutlined } from '@ant-design/icons';
import { Button, Card, Image, Upload } from 'antd';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import { useEffect, useState } from 'react';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export const ProductImages = ({
  images,
  action,
}: {
  images: ProductImage[];
  action: 'show' | 'edit';
}) => {
  const [thumbnail, setThumbnail] = useState<UploadFile>();
  const [imgs, setImgs] = useState<UploadFile[]>();
  const [previewImage, setPreviewImage] = useState('');
  const [previewOpen, setPreviewOpen] = useState(false);

  const thumbnailImg = images.filter((img) => img.isThumbnail == true)[0];

  useEffect(() => {
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
  }, []);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChangeThumbnail: UploadProps['onChange'] = ({ file }) =>
    setThumbnail({
      uid: file.uid,
      url: URL.createObjectURL(file as any),
      name: 'Thumbnail',
    });

  const handleChangeImgs: UploadProps['onChange'] = ({
    fileList: newFileList,
  }) => setImgs(newFileList);

  return (
    <Card>
      <div className='flex flex-col gap-3'>
        <div className='flex-1 gallery-main'>
          <Image src={thumbnail?.url || thumbnail?.preview} />
          {action == 'edit' && (
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
        <div className='flex gap-2 shrink-0'>
          {action == 'show' ? (
            imgs?.map((img) => (
              <Image key={img.uid} src={img.url} width={64} height={64} />
            ))
          ) : (
            <>
              <Upload
                listType='picture-card'
                style={{ width: 64, height: 64 }}
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
    </Card>
  );
};
