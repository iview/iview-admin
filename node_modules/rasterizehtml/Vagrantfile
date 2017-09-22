# -*- mode: ruby -*-
# vi: set ft=ruby :

# All Vagrant configuration is done below. The "2" in Vagrant.configure
# configures the configuration version (we support older styles for
# backwards compatibility). Please don't change it unless you know what
# you're doing.
Vagrant.configure(2) do |config|
  config.vm.box = "ubuntu/trusty64"

  config.vm.provider "virtualbox" do |v|
    v.memory = 2048
  end

  config.vm.provision "shell", inline: <<-SHELL
     sudo echo "nameserver 8.8.8.8" > /etc/resolv.conf
     sudo apt-get update
     sudo apt-get install -y nodejs nodejs-legacy npm xvfb git firefox libfontconfig
     sudo npm install npm -g
     if [ ! -d "rasterizeHTML.js" ]; then
         git clone https://github.com/cburgmer/rasterizeHTML.js.git
         sudo chown vagrant:vagrant -R rasterizeHTML.js
     fi
     cd rasterizeHTML.js
     git pull
     echo "You can now run the test suite via $ xvfb-run ./go"
  SHELL
end
