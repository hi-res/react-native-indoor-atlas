Pod::Spec.new do |s|
  s.name         = "RNIndoorAtlas"
  s.version      = "1.0.0"
  s.summary      = "IndoorAtlas for react-native"

  s.homepage     = "https://github.com/hi-res/react-native-indoor-atlas"

  s.license      = "GPL"
  s.authors      = { "Samuel Rounce" => "rounce@killin.gs" }
  s.platform     = :ios, "8.0"

  s.source       = { :git => "https://github.com/hi-res/react-native-indoor-atlas.git" }

  s.source_files  = "ios/*.{h,m}"

  s.dependency 'IndoorAtlas'
  s.dependency 'React'
end
