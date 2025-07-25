
import { Editor } from '@tinymce/tinymce-react';
import { useRef } from 'react';

interface TinyMCEEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: number;
}

export default function TinyMCEEditor({
  value,
  onChange,
  placeholder = "Start writing your blog post...",
  height = 400,
}: TinyMCEEditorProps) {
  const editorRef = useRef<any>(null);

  return (
    <Editor
      tinymceScriptSrc="/tinymce/tinymce.min.js"
      onInit={(evt, editor) => editorRef.current = editor}
      value={value}
      onEditorChange={onChange}
      init={{
        height,
        menubar: 'file edit view insert format tools table help',
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
          'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
          'insertdatetime', 'media', 'table', 'help', 'wordcount', 'codesample',
          'emoticons', 'template', 'paste', 'textcolor', 'colorpicker', 'hr',
          'pagebreak', 'nonbreaking', 'toc', 'imagetools'
        ],
        toolbar1: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | forecolor backcolor | alignleft aligncenter alignright alignjustify',
        toolbar2: 'bullist numlist outdent indent | link image media table | codesample hr pagebreak | emoticons charmap | code fullscreen preview | help',
        toolbar3: 'cut copy paste pastetext | searchreplace | spellchecker | visualblocks visualchars | ltr rtl | removeformat',
        
        // Content styling for better blog layout
        content_style: `
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; 
            font-size: 16px; 
            line-height: 1.6; 
            color: #374151;
            max-width: none;
            margin: 0;
            padding: 20px;
          }
          h1, h2, h3, h4, h5, h6 { 
            color: #1f2937; 
            margin-top: 2em; 
            margin-bottom: 1em; 
            font-weight: 600;
          }
          h1 { font-size: 2.25em; line-height: 1.2; }
          h2 { font-size: 1.875em; line-height: 1.3; }
          h3 { font-size: 1.5em; line-height: 1.4; }
          p { 
            margin-bottom: 1.5em; 
            text-align: justify; 
          }
          img { 
            max-width: 100%; 
            height: auto; 
            border-radius: 8px; 
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
            margin: 1.5em 0;
          }
          .mce-object-iframe {
            border-radius: 8px;
            margin: 1.5em 0;
          }
          blockquote { 
            border-left: 4px solid #3b82f6; 
            margin: 1.5em 0; 
            padding: 1em 1.5em; 
            background: #f8fafc; 
            font-style: italic;
            border-radius: 0 8px 8px 0;
          }
          code { 
            background: #f1f5f9; 
            padding: 0.25em 0.5em; 
            border-radius: 4px; 
            font-family: 'Monaco', 'Cascadia Code', 'Consolas', monospace;
            font-size: 0.875em;
          }
          pre { 
            background: #1e293b; 
            color: #e2e8f0; 
            padding: 1.5em; 
            border-radius: 8px; 
            overflow-x: auto;
            margin: 1.5em 0;
          }
          pre code { 
            background: none; 
            padding: 0; 
            color: inherit;
          }
          table { 
            border-collapse: collapse; 
            width: 100%; 
            margin: 1.5em 0;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          }
          th, td { 
            border: 1px solid #e5e7eb; 
            padding: 0.75em 1em; 
            text-align: left; 
          }
          th { 
            background: #f9fafb; 
            font-weight: 600;
          }
          ul, ol { 
            margin: 1.5em 0; 
            padding-left: 2em; 
          }
          li { 
            margin-bottom: 0.5em; 
          }
          hr {
            border: none;
            height: 2px;
            background: linear-gradient(to right, #3b82f6, #8b5cf6, #3b82f6);
            margin: 2em 0;
            border-radius: 1px;
          }
        `,
        
        placeholder,
        
        // Enhanced image handling
        image_advtab: true,
        image_uploadtab: true,
        image_class_list: [
          { title: 'Responsive', value: 'img-responsive' },
          { title: 'Full Width', value: 'img-full-width' },
          { title: 'Centered', value: 'img-center' },
          { title: 'Float Left', value: 'img-float-left' },
          { title: 'Float Right', value: 'img-float-right' }
        ],
        image_caption: true,
        image_title: true,
        automatic_uploads: true,
        file_picker_types: 'image',
        
        // Media (video/embed) configuration
        media_live_embeds: true,
        media_filter_html: false,
        media_url_resolver: (data, resolve) => {
          if (data.url.indexOf('youtube.com') !== -1 || data.url.indexOf('youtu.be') !== -1) {
            let videoId = '';
            if (data.url.indexOf('youtu.be') !== -1) {
              videoId = data.url.split('/').pop().split('?')[0];
            } else {
              videoId = data.url.split('v=')[1]?.split('&')[0];
            }
            if (videoId) {
              resolve({
                html: `<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; border-radius: 8px; margin: 1.5em 0;">
                  <iframe src="https://www.youtube.com/embed/${videoId}" 
                          style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;" 
                          allowfullscreen></iframe>
                </div>`
              });
              return;
            }
          }
          resolve({ html: '' });
        },
        
        // Code sample configuration
        codesample_languages: [
          { text: 'HTML/XML', value: 'markup' },
          { text: 'JavaScript', value: 'javascript' },
          { text: 'TypeScript', value: 'typescript' },
          { text: 'CSS', value: 'css' },
          { text: 'PHP', value: 'php' },
          { text: 'Ruby', value: 'ruby' },
          { text: 'Python', value: 'python' },
          { text: 'Java', value: 'java' },
          { text: 'C', value: 'c' },
          { text: 'C#', value: 'csharp' },
          { text: 'C++', value: 'cpp' },
          { text: 'SQL', value: 'sql' },
          { text: 'JSON', value: 'json' },
          { text: 'Bash', value: 'bash' }
        ],
        codesample_global_prismjs: true,
        
        // Templates for common blog structures
        templates: [
          {
            title: 'Blog Post with Image',
            description: 'Standard blog post layout with featured image',
            content: `
              <h1>Your Blog Title Here</h1>
              <p><img src="https://via.placeholder.com/800x400" alt="Featured image" /></p>
              <p>Introduction paragraph that hooks the reader...</p>
              <h2>Main Section</h2>
              <p>Your content here...</p>
              <h2>Conclusion</h2>
              <p>Wrap up your thoughts...</p>
            `
          },
          {
            title: 'Tutorial with Code',
            description: 'Tutorial layout with code examples',
            content: `
              <h1>How to Tutorial Title</h1>
              <p>Brief introduction to what we'll learn...</p>
              <h2>Prerequisites</h2>
              <ul>
                <li>Item 1</li>
                <li>Item 2</li>
              </ul>
              <h2>Step 1: Setup</h2>
              <p>Explanation...</p>
              <pre class="language-javascript"><code>// Your code example here
console.log('Hello World!');</code></pre>
              <h2>Step 2: Implementation</h2>
              <p>More content...</p>
            `
          }
        ],
        
        // File picker for image uploads
        file_picker_callback: (cb, value, meta) => {
          const input = document.createElement('input');
          input.setAttribute('type', 'file');
          input.setAttribute('accept', 'image/*');

          input.addEventListener('change', (e: any) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.addEventListener('load', () => {
              const id = 'blobid' + (new Date()).getTime();
              const blobCache = (window as any).tinymce.activeEditor.editorUpload.blobCache;
              const base64 = (reader.result as string).split(',')[1];
              const blobInfo = blobCache.create(id, file, base64);
              blobCache.add(blobInfo);
              cb(blobInfo.blobUri(), { title: file.name, alt: file.name });
            });
            reader.readAsDataURL(file);
          });

          input.click();
        },
        
        // Better paste handling
        paste_as_text: false,
        paste_auto_cleanup_on_paste: true,
        paste_remove_styles: false,
        paste_remove_styles_if_webkit: false,
        paste_strip_class_attributes: 'none',
        
        // Setup function for additional customizations
        setup: (editor) => {
          editor.on('init', () => {
            const container = editor.getContainer();
            container.style.transition = 'border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out';
            container.style.borderRadius = '8px';
          });
          
          editor.on('focus', () => {
            const container = editor.getContainer();
            container.style.borderColor = '#3b82f6';
            container.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
          });
          
          editor.on('blur', () => {
            const container = editor.getContainer();
            container.style.borderColor = '#d1d5db';
            container.style.boxShadow = 'none';
          });

          // Custom button for embedding videos
          editor.ui.registry.addButton('embedvideo', {
            text: 'Embed Video',
            icon: 'embed',
            onAction: () => {
              editor.windowManager.open({
                title: 'Embed Video',
                body: {
                  type: 'panel',
                  items: [
                    {
                      type: 'input',
                      name: 'videourl',
                      label: 'Video URL (YouTube, Vimeo, etc.)',
                      placeholder: 'https://www.youtube.com/watch?v=...'
                    }
                  ]
                },
                buttons: [
                  {
                    type: 'cancel',
                    text: 'Close'
                  },
                  {
                    type: 'submit',
                    text: 'Embed',
                    primary: true
                  }
                ],
                onSubmit: (api) => {
                  const data = api.getData();
                  if (data.videourl) {
                    editor.insertContent(`<p>${data.videourl}</p>`);
                    editor.execCommand('mceMedia');
                  }
                  api.close();
                }
              });
            }
          });
        },
        
        skin: 'oxide',
        content_css: 'default',
        branding: false,
        resize: 'both',
        statusbar: true,
        elementpath: false,
        
        // Better responsive behavior
        mobile: {
          theme: 'mobile',
          plugins: ['autosave', 'lists', 'autolink'],
          toolbar: 'undo bold italic | bullist numlist | link image'
        }
      }}
    />
  );
}
