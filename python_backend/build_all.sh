rm -f -r build_env 
rm -f custom_python.zip
pip install -r requirements.txt --target build_env
zip -r custom_python.zip custom_python/ util/
cd build_env && zip -r ../custom_python.zip *
cd ..
cp custom_python.zip ../cdk-project/.
